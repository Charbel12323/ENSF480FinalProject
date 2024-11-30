package ENSF480.uofc.Backend.Payment;

import java.util.List;

public class ConfirmBookingRequest {
    private int userId;
    private List<Integer> seatIds;

    // Getters and Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<Integer> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Integer> seatIds) {
        this.seatIds = seatIds;
    }
}
