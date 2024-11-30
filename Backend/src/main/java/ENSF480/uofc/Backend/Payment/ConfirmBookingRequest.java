package ENSF480.uofc.Backend.Payment;

import java.util.List;

public class ConfirmBookingRequest {
    private int userId; // Corresponds to `user_id` in Users table
    private List<Integer> seatIds; // List of seat IDs to reserve

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
