package ENSF480.uofc.Backend.Payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Custom query to find all payment methods for a specific user
    List<Payment> findByUserId(int userId);
}
