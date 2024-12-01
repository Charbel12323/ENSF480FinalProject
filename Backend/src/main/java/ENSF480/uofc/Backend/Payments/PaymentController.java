package ENSF480.uofc.Backend.Payments;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.sendgrid.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.github.cdimascio.dotenv.Dotenv;
import ENSF480.uofc.Backend.users.User;
import ENSF480.uofc.Backend.users.UserService;

import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final String stripeSecretKey;
    private final String sendGridApiKey;

    @Autowired
    private UserService userService;

    public PaymentController() {
        Dotenv dotenv = Dotenv.configure().directory("src/main/resources").filename(".env").load();
        this.stripeSecretKey = dotenv.get("STRIPE_API_KEY");
        this.sendGridApiKey = dotenv.get("SENDGRID_API_KEY");
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> requestBody) {
        try {
            Stripe.apiKey = stripeSecretKey;

            // Get current user from session
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            if (!requestBody.containsKey("amount")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Amount is required"));
            }

            int amount = ((Number) requestBody.get("amount")).intValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount)
                    .setCurrency("usd")
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment intent: " + e.getMessage()));
        }
    }

    @PostMapping("/create-registration-payment-intent")
    public ResponseEntity<?> createRegistrationPaymentIntent(@RequestBody Map<String, String> requestBody) {
        try {
            Stripe.apiKey = stripeSecretKey;

            if (!validatePaymentRequest(requestBody)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing or invalid payment parameters"));
            }

            int amount = 2000; // Registration fee in cents ($20)
            String currency = "usd";

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount)
                    .setCurrency(currency)
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());
            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create registration payment intent: " + e.getMessage()));
        }
    }

    private boolean validatePaymentRequest(Map<String, String> requestBody) {
        return requestBody != null &&
                requestBody.containsKey("email") &&
                requestBody.containsKey("name") &&
                requestBody.containsKey("password");
    }

    @PostMapping("/confirm-registration")
    public ResponseEntity<?> confirmRegistration(@RequestBody Map<String, String> requestBody) {
        try {
            if (!requestBody.containsKey("name") ||
                    !requestBody.containsKey("email") ||
                    !requestBody.containsKey("password")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Name, email, and password are required"));
            }

            String name = requestBody.get("name");
            String email = requestBody.get("email");
            String password = requestBody.get("password");

            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setGuest(false);

            userService.registerUser(newUser);

            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to confirm registration: " + e.getMessage()));
        }
    }

    @PostMapping("/send-confirmation-email")
    public ResponseEntity<?> sendConfirmationEmail(@RequestBody Map<String, Object> requestBody) {
        try {
            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            int seatCount = requestBody.get("seatCount") != null ? ((Number) requestBody.get("seatCount")).intValue()
                    : 1;

            String subject = "Your Seat Purchase Confirmation";
            String content = "Hello " + currentUser.getName() + ",\n\n" +
                    "Thank you for your purchase!\n" +
                    "You have successfully purchased " + seatCount + " seats.\n\n" +
                    "Best regards,\nThe Team";

            sendEmail(currentUser.getEmail(), subject, content);

            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send confirmation email: " + e.getMessage()));
        }
    }

    private void sendEmail(String recipientEmail, String subject, String content) throws IOException {
        Email from = new Email("mcharbe439@gmail.com"); // Replace with your verified sender email
        Email to = new Email(recipientEmail);
        Content emailContent = new Content("text/plain", content);
        Mail mail = new Mail(from, subject, to, emailContent);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        if (response.getStatusCode() >= 400) {
            throw new IOException("Failed to send email. Status code: " + response.getStatusCode() +
                    " Body: " + response.getBody());
        }
    }
}