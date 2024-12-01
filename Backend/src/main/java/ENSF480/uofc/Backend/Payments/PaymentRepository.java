package ENSF480.uofc.Backend.Payments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    /**
     * Find all saved payment methods for a specific user.
     * @param userId ID of the user.
     * @return List of Payment entities.
     */
    List<Payment> findByUserId(int userId);

    /**
     * Find a saved payment method by its unique payment method ID.
     * @param paymentMethodId ID of the payment method.
     * @return A Payment entity.
     */
    Payment findByPaymentMethodId(String paymentMethodId);
}
