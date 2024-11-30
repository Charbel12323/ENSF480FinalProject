package ENSF480.uofc.Backend.Transactions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    // Custom query to find transactions by user ID
    List<Transaction> findByUserId(int userId);

    // Custom query to find transactions by transaction status (e.g., success, pending)
    List<Transaction> findByTransactionStatus(String transactionStatus);
}
