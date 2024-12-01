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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    private final String stripeSecretKey;
    private final String sendGridApiKey;
    private final SendGrid sendGrid;

    @Autowired
    private UserService userService;

    public PaymentController() {
        Dotenv dotenv = Dotenv.configure().directory("src/main/resources").filename(".env").load();
        this.stripeSecretKey = dotenv.get("STRIPE_API_KEY");
        this.sendGridApiKey = dotenv.get("SENDGRID_API_KEY");
        this.sendGrid = new SendGrid(sendGridApiKey);
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> requestBody) {
        try {
            Stripe.apiKey = stripeSecretKey;

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

            int amount = 2000;
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

            User newUser = new User();
            newUser.setName(requestBody.get("name"));
            newUser.setEmail(requestBody.get("email"));
            newUser.setPassword(requestBody.get("password"));
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
            if (requestBody == null || !requestBody.containsKey("email") || !requestBody.containsKey("name")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email and name are required"));
            }

            String recipientEmail = (String) requestBody.get("email");
            String recipientName = (String) requestBody.get("name");
            int seatCount = requestBody.get("seatCount") != null ? ((Number) requestBody.get("seatCount")).intValue()
                    : 1;

            String subject = "Your Movie Ticket Purchase Confirmation";
            String contentText = String.format(
                    "Hello %s,\n\n" +
                            "Thank you for your purchase!\n" +
                            "You have successfully purchased %d ticket(s).\n\n" +
                            "Please arrive at least 15 minutes before your showtime.\n\n" +
                            "Best regards,\nThe Cinema Team",
                    recipientName,
                    seatCount);

            Email from = new Email("mcharbe439@gmail.com");
            Email to = new Email(recipientEmail);
            Content content = new Content("text/plain", contentText);
            Mail mail = new Mail(from, subject, to, content);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 400) {
                throw new IOException("Failed to send email. Status code: " + response.getStatusCode());
            }

            return ResponseEntity.ok(Map.of("message", "Email sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send confirmation email: " + e.getMessage()));
        }
    }
}