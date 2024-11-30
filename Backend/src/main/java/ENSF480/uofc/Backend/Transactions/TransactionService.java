package ENSF480.uofc.Backend.Transactions;

import ENSF480.uofc.Backend.Payments.Payment;
import ENSF480.uofc.Backend.Payments.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Create a new transaction.
     * @param transactionDTO Data Transfer Object containing transaction details.
     * @return The created Transaction entity.
     */
    public Transaction createTransaction(TransactionDTO transactionDTO) {
        // Retrieve the payment method used for the transaction
        Optional<Payment> paymentOptional = paymentRepository.findById(transactionDTO.getPaymentId());

        if (paymentOptional.isEmpty()) {
            throw new IllegalArgumentException("Payment method not found for ID: " + transactionDTO.getPaymentId());
        }

        Payment payment = paymentOptional.get();

        // Create a new Transaction entity
        Transaction transaction = new Transaction();
        transaction.setUserId(transactionDTO.getUserId());
        transaction.setPayment(payment);
        transaction.setTotalAmount(transactionDTO.getTotalAmount());
        transaction.setCurrency(transactionDTO.getCurrency());
        transaction.setTransactionStatus("pending"); // Default status is 'pending'

        // Save the transaction to the database
        return transactionRepository.save(transaction);
    }

    /**
     * Update the status of a transaction.
     * @param transactionId ID of the transaction to update.
     * @param status New status for the transaction (e.g., success, failed).
     */
    public void updateTransactionStatus(int transactionId, String status) {
        Optional<Transaction> transactionOptional = transactionRepository.findById(transactionId);

        if (transactionOptional.isEmpty()) {
            throw new IllegalArgumentException("Transaction not found for ID: " + transactionId);
        }

        Transaction transaction = transactionOptional.get();
        transaction.setTransactionStatus(status);

        // Save the updated transaction to the database
        transactionRepository.save(transaction);
    }

    /**
     * Retrieve all transactions for a specific user.
     * @param userId ID of the user.
     * @return List of transactions for the user.
     */
    public List<Transaction> getTransactionsByUserId(int userId) {
        return transactionRepository.findByUserId(userId);
    }
}
