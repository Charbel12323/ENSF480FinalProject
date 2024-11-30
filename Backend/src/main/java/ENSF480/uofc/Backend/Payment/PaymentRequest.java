package ENSF480.uofc.Backend.Payment;

public class PaymentRequest {
    private int amount; // Amount in cents
    private String currency; // e.g., "usd"
    private int userId; // Corresponds to the `user_id` in Users table

    // Getters and Setters
    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
