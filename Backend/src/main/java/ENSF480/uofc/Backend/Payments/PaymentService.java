package ENSF480.uofc.Backend.Payments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment savePayment(PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setUserId(paymentDTO.getUserId());
        payment.setPaymentMethodId(paymentDTO.getPaymentMethodId());
        payment.setCardLastFourDigits(paymentDTO.getCardLastFourDigits());
        payment.setExpirationDate(paymentDTO.getExpirationDate());
        return paymentRepository.save(payment);
    }


    /**
     * Retrieve all saved payment methods for a specific user.
     * @param userId ID of the user whose payment methods are being retrieved.
     * @return List of Payment entities.
     */
    public List<Payment> getPaymentsByUserId(int userId) {
        return paymentRepository.findByUserId(userId);
    }

    /**
     * Use a saved payment method for a transaction.
     * @param paymentMethodId ID of the saved payment method.
     */
    public void useSavedPaymentMethod(String paymentMethodId) {
        // Find the payment method by ID
        Payment payment = paymentRepository.findByPaymentMethodId(paymentMethodId);
        if (payment == null) {
            throw new RuntimeException("Payment method not found.");
        }

        // Simulate the use of the payment method
        System.out.println("Using saved payment method: " + paymentMethodId);

        // Implement any additional logic for processing the transaction if needed.
        // For example, you could call a Stripe API to reuse the payment method.
    }
}
