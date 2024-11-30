package ENSF480.uofc.Backend.Transactions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    /**
     * Create a new transaction.
     * @param transactionDTO Data Transfer Object containing transaction details.
     * @return Response with the created transaction.
     */
    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        try {
            Transaction transaction = transactionService.createTransaction(transactionDTO);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    /**
     * Update the status of a transaction.
     * @param transactionId ID of the transaction to update.
     * @param status New status for the transaction (e.g., success, failed).
     * @return Response indicating success or failure.
     */
    @PutMapping("/{transactionId}/status")
    public ResponseEntity<String> updateTransactionStatus(@PathVariable int transactionId, @RequestParam String status) {
        try {
            transactionService.updateTransactionStatus(transactionId, status);
            return ResponseEntity.ok("Transaction status updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating transaction status: " + e.getMessage());
        }
    }

    /**
     * Retrieve all transactions for a user.
     * @param userId ID of the user.
     * @return List of transactions for the user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(@PathVariable int userId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByUserId(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
