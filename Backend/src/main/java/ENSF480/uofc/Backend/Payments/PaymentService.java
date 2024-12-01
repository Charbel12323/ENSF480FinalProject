package ENSF480.uofc.Backend.Payments;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Save a new payment method to the database.
     * @param paymentDTO Data Transfer Object containing payment details.
     */
    public Payment savePayment(PaymentDTO paymentDTO) {
        // Create a new Payment entity
        Payment payment = new Payment();
        payment.setUserId(paymentDTO.getUserId());
        payment.setPaymentMethodId(paymentDTO.getPaymentMethodId());
        payment.setCardLastFourDigits(paymentDTO.getCardLastFourDigits());
        payment.setExpirationDate(paymentDTO.getExpirationDate());

        // Save the payment entity to the database
        paymentRepository.save(payment);
        return payment;
    }

    /**
     * Retrieve all saved payment methods for a specific user.
     * @param userId ID of the user whose payment methods are being retrieved.
     * @return List of Payment entities.
     */
    public List<Payment> getPaymentsByUserId(int userId) {
        return paymentRepository.findByUserId(userId);
    }
}
