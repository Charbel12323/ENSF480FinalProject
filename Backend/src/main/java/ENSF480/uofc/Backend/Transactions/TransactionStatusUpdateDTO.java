package ENSF480.uofc.Backend.Transactions;

// Create a DTO for the status update request
public class TransactionStatusUpdateDTO {
    private String status;
    private Integer paymentId;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }
}