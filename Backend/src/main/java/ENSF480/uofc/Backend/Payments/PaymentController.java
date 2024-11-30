package ENSF480.uofc.Backend.Payments;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    // Hardcoded Stripe secret key for testing purposes
    private final String stripeSecretKey = "sk_test_51QQgDtDUKjAvOoW4eoccwianifHzGXwRzf1e4eckm48dl0OINMEA4QPAuSU8q5r8JvLREzL5IB0ZfWNZN9z7J6Mv00KlUW91N9";

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> requestBody) {
        // Set the Stripe API key
        Stripe.apiKey = stripeSecretKey;

        try {
            // Validate the request payload
            if (!requestBody.containsKey("amount") || !requestBody.containsKey("currency")) {
                throw new IllegalArgumentException("Invalid request: 'amount' and 'currency' are required.");
            }

            int amount = (int) requestBody.get("amount");
            if (amount <= 0) {
                throw new IllegalArgumentException("Invalid amount: must be greater than 0.");
            }

            String currency = (String) requestBody.get("currency");

            // Create the PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount) // Stripe expects the amount in cents
                    .setCurrency(currency)
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Return the client secret to the frontend
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());
            return responseData;

        } catch (StripeException e) {
            System.err.println("StripeException: " + e.getMessage());
            throw new RuntimeException("Failed to create PaymentIntent: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Error creating PaymentIntent: " + e.getMessage());
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }
}
