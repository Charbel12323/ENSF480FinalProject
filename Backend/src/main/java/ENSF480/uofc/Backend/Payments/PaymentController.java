package ENSF480.uofc.Backend.Payments;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    // Inject Stripe API key from environment variable or configuration file
    private String stripeSecretKey;

    public PaymentController() {
        Dotenv dotenv = Dotenv.configure().directory("src/main/resources")  // Explicitly point to the resources folder
        .filename(".env")                 // The name of your .env file
        .load();
        this.stripeSecretKey = dotenv.get("STRIPE_API_KEY");

    }

    @PostMapping("/create-payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Map<String, Object> requestBody) {
        // Set Stripe API key for this request
        Stripe.apiKey = stripeSecretKey;

        try {
            // Extract amount and currency from the request body
            int amount = (int) requestBody.get("amount"); // amount should be in cents
            String currency = (String) requestBody.get("currency");

            // Create the payment intent parameters
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount)  // Stripe expects the amount in cents
                    .setCurrency(currency)
                    .build();

            // Create the payment intent using Stripe API
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Prepare the response with the client secret
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", paymentIntent.getClientSecret());

            return responseData;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage(), e);
        }
    }
}
