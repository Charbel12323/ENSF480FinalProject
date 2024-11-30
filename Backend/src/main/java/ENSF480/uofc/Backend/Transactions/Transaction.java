package ENSF480.uofc.Backend.Transactions;

import ENSF480.uofc.Backend.Payments.Payment;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "Transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionId; // Unique ID for each transaction

    @Column(nullable = false)
    private int userId; // Links the transaction to a specific user

    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment; // Links the transaction to a saved payment method

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount; // Total amount for the transaction

    @Column(nullable = false, length = 10)
    private String currency; // Currency for the transaction (e.g., USD)

    @Column(nullable = false, length = 20)
    private String transactionStatus; // Status of the transaction: pending, success, failed

    @Column(nullable = false)
    private Date createdAt; // When the transaction was created

    @Column(nullable = false)
    private Date updatedAt; // When the transaction was last updated

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    // Getters and setters
    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
