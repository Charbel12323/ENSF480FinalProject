package ENSF480.uofc.Backend.Payments;

import ENSF480.uofc.Backend.Transactions.Transaction;
import ENSF480.uofc.Backend.Transactions.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * Save a new payment method to the database.
     * 
     * @param paymentDTO Data Transfer Object containing payment details.
     * @return The saved Payment entity.
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
     * 
     * @param userId ID of the user whose payment methods are being retrieved.
     * @return List of Payment entities.
     */
    public List<Payment> getPaymentsByUserId(int userId) {
        return paymentRepository.findByUserId(userId);
    }

    /**
     * Create a transaction for the payment and save it in the database.
     * 
     * @param userId            ID of the user initiating the transaction.
     * @param totalAmount       Total amount for the transaction.
     * @param currency          Currency for the transaction (e.g., USD).
     * @param transactionStatus Initial status of the transaction (e.g., pending).
     * @return The saved Transaction entity.
     */
    public Transaction createTransaction(int userId, BigDecimal totalAmount, String currency,
            String transactionStatus) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setTotalAmount(totalAmount);
        transaction.setCurrency(currency);
        transaction.setTransactionStatus(transactionStatus);

        // Save the transaction entity
        return transactionRepository.save(transaction);
    }

    /**
     * Update transaction status upon successful payment.
     * 
     * @param transactionId ID of the transaction.
     * @param paymentId     ID of the completed payment.
     * @param status        New transaction status (e.g., "completed").
     */

}
