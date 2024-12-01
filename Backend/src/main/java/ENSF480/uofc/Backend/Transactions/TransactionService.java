package ENSF480.uofc.Backend.Transactions;

import ENSF480.uofc.Backend.Payments.Payment;
import ENSF480.uofc.Backend.Payments.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public Transaction createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setUserId(transactionDTO.getUserId());
        transaction.setTotalAmount(transactionDTO.getTotalAmount());
        transaction.setCurrency(transactionDTO.getCurrency());
        transaction.setTransactionStatus("pending");
        transaction.setPayment(null); // Initially no payment

        return transactionRepository.save(transaction);
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
