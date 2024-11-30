package ENSF480.uofc.Backend.Payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, Object>> createPaymentIntent(@RequestBody PaymentRequest paymentRequest) {
        Map<String, Object> response = paymentService.createPaymentIntent(paymentRequest);
        return response.containsKey("error")
                ? ResponseEntity.status(400).body(response)
                : ResponseEntity.ok(response);
    }

    @PostMapping("/confirm-booking")
    public ResponseEntity<String> confirmBooking(@RequestBody ConfirmBookingRequest request) {
        try {
            String response = paymentService.confirmBooking(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}
