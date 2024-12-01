package ENSF480.uofc.Backend.Payments;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final String stripeSecretKey;
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;

        // Load Stripe API key from the environment
        Dotenv dotenv = Dotenv.configure()
                .directory("src/main/resources")
                .filename(".env")
                .load();
        this.stripeSecretKey = dotenv.get("STRIPE_API_KEY");
        Stripe.apiKey = this.stripeSecretKey; // Set Stripe API key globally
    }

    /**
     * Create a payment intent for a transaction.
     * @param requestBody Request containing payment amount and currency.
     * @return Client secret for the created payment intent.
     */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract amount and currency from the request
            int amount = (int) requestBody.get("amount"); // Amount in cents
            String currency = (String) requestBody.get("currency");

            // Create payment intent parameters
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount)
                    .setCurrency(currency)
                    .build();

            // Create the payment intent using Stripe API
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Prepare the response
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());

            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            e.printStackTrace(); // Log error for debugging
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create payment intent: " + e.getMessage()));
        }
    }

    /**
     * Save a new payment method.
     * @param paymentDTO Data Transfer Object containing payment details.
     * @return Response indicating success or failure.
     */
    @PostMapping("/save")
    public ResponseEntity<Payment> savePaymentMethod(@RequestBody PaymentDTO paymentDTO) {
        try {
            Payment savedPayment = paymentService.savePayment(paymentDTO);
            return ResponseEntity.ok(savedPayment);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    /**
     * Retrieve all saved payment methods for a user.
     * @param userId ID of the user.
     * @return List of Payment entities.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Payment>> getPaymentMethods(@PathVariable int userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    /**
     * Use an existing payment method for a transaction.
     * @param paymentMethodId ID of the saved payment method.
     * @return Response indicating success or failure.
     */
    @PostMapping("/use")
    public ResponseEntity<String> useSavedPaymentMethod(@RequestParam String paymentMethodId) {
        try {
            paymentService.useSavedPaymentMethod(paymentMethodId);
            return ResponseEntity.ok("Payment method used successfully for the transaction.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error using saved payment method: " + e.getMessage());
        }
    }
}
