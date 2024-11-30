package ENSF480.uofc.Backend.Payments;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId; // Unique ID for each payment method

    @Column(nullable = false)
    private int userId; // Links the payment to a specific user

    @Column(nullable = false, unique = true, length = 255)
    private String paymentMethodId; // Stripe Payment Method ID

    @Column(length = 4)
    private String cardLastFourDigits; // Last 4 digits of the card (for display purposes)

    @Column
    private LocalDate expirationDate; // Expiration date of the card (optional)

    @Column(nullable = false)
    private Date createdAt; // Timestamp when the payment method was saved

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date(); // Automatically set the createdAt timestamp
    }

    // Getters and setters
    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getCardLastFourDigits() {
        return cardLastFourDigits;
    }

    public void setCardLastFourDigits(String cardLastFourDigits) {
        this.cardLastFourDigits = cardLastFourDigits;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
