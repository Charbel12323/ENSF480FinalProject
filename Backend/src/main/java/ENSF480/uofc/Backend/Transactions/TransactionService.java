package ENSF480.uofc.Backend.Transactions;

import ENSF480.uofc.Backend.Payments.Payment;
import ENSF480.uofc.Backend.Payments.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
     * 
     * @param transactionDTO Data Transfer Object containing transaction details.
     * @return The created Transaction.
     */
    public Transaction createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setUserId(transactionDTO.getUserId());
        transaction.setTotalAmount(transactionDTO.getTotalAmount());
        transaction.setCurrency(transactionDTO.getCurrency());
        transaction.setTransactionStatus("pending"); // Set initial status to pending

        return transactionRepository.save(transaction);
    }

    /**
     * Update the status of a transaction.
     * 
     * @param transactionId ID of the transaction.
     * @param status        New status for the transaction.
     * @param paymentId     Optional payment ID associated with the transaction.
     */
    public void updateTransactionStatus(int transactionId, String status, String paymentId) {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);
        if (optionalTransaction.isPresent()) {
            Transaction transaction = optionalTransaction.get();
            transaction.setTransactionStatus(status);

            transactionRepository.save(transaction);
        } else {
            throw new IllegalArgumentException("Transaction not found with ID: " + transactionId);
        }
    }

    /**
     * Retrieve all transactions for a user.
     * 
     * @param userId ID of the user.
     * @return List of transactions.
     */
    public List<Transaction> getTransactionsByUserId(int userId) {
        return transactionRepository.findByUserId(userId);
    }
}
