package ENSF480.uofc.Backend.Transactions;

import ENSF480.uofc.Backend.Payments.Payment;
import ENSF480.uofc.Backend.Payments.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;


    public Transaction createTransaction(TransactionDTO transactionDTO) {
        // Validate required fields
        if (transactionDTO.getTotalAmount() == null || transactionDTO.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Total amount must be greater than zero");
        }
        
        if (transactionDTO.getCurrency() == null || transactionDTO.getCurrency().trim().isEmpty()) {
            throw new IllegalArgumentException("Currency is required");
        }

        try {
            Transaction transaction = new Transaction();
            
            // Set user ID if provided (might be null for guest/registration transactions)
            transaction.setUserId(transactionDTO.getUserId());
            
            // Set the required fields
            transaction.setTotalAmount(transactionDTO.getTotalAmount());
            transaction.setCurrency(transactionDTO.getCurrency().toLowerCase());
            
            // Always start with pending status
            transaction.setTransactionStatus("pending");
            
            // Payment will be set later when the transaction is completed
            transaction.setPayment(null);

            return transactionRepository.save(transaction);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create transaction: " + e.getMessage(), e);
        }
    }

    public void updateTransactionStatus(int transactionId, String status, Integer paymentId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        transaction.setTransactionStatus(status);
        
        if ("success".equalsIgnoreCase(status)) {
            if (paymentId != null && paymentId != 0) {
                Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + paymentId));
                transaction.setPayment(payment);
            }
        } else if ("failed".equalsIgnoreCase(status)) {
            transaction.setPayment(null);
        } else {
            throw new IllegalArgumentException("Invalid transaction status: " + status);
        }

        transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUserId(int userId) {
        return transactionRepository.findByUserId(userId);
    }
}
