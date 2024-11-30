package ENSF480.uofc.Backend.Payments;

import java.time.LocalDate;

public class PaymentDTO {

    private int userId; // User associated with the payment method
    private String paymentMethodId; // Stripe Payment Method ID
    private String cardLastFourDigits; // Last 4 digits of the card
    private LocalDate expirationDate; // Expiration date of the card

    // Default constructor
    public PaymentDTO() {}

    // Parameterized constructor
    public PaymentDTO(int userId, String paymentMethodId, String cardLastFourDigits, LocalDate expirationDate) {
        this.userId = userId;
        this.paymentMethodId = paymentMethodId;
        this.cardLastFourDigits = cardLastFourDigits;
        this.expirationDate = expirationDate;
    }

    // Getters and setters
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
}
