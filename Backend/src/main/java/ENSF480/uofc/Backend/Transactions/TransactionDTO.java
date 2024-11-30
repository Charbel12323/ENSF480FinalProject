package ENSF480.uofc.Backend.Transactions;

import java.math.BigDecimal;

public class TransactionDTO {

    private int userId; // User associated with the transaction
    private int paymentId; // Payment method used for the transaction
    private BigDecimal totalAmount; // Total amount for the transaction
    private String currency; // Currency of the transaction
    private String transactionStatus; // Status of the transaction: pending, success, failed

    // Default constructor
    public TransactionDTO() {}

    // Parameterized constructor
    public TransactionDTO(int userId, int paymentId, BigDecimal totalAmount, String currency, String transactionStatus) {
        this.userId = userId;
        this.paymentId = paymentId;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.transactionStatus = transactionStatus;
    }

    // Getters and setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
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
}
