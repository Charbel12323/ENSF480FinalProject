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
    public ResponseEntity<?> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        try {
            Transaction transaction = transactionService.createTransaction(transactionDTO);
            return ResponseEntity.ok(transaction);
        } catch (IllegalArgumentException e) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid input: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Error creating transaction: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Update the status of a transaction.
     * @param transactionId ID of the transaction to update.
     * @param status New status for the transaction (e.g., success, failed).
     * @return Response indicating success or failure.
     */
    @PutMapping("/{transactionId}/status")
    public ResponseEntity<?> updateTransactionStatus(
            @PathVariable int transactionId,
            @RequestBody TransactionStatusUpdateDTO updateDTO) {
        try {
            transactionService.updateTransactionStatus(
                transactionId, 
                updateDTO.getStatus(),
                updateDTO.getPaymentId()
            );
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse(e.getMessage()));
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
