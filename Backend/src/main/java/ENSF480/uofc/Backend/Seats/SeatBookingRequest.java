package ENSF480.uofc.Backend.Seats;

import java.util.List;

public class SeatBookingRequest {
    private List<Integer> seatIds;
    private int userId;
    private String email;

    // Getters and setters
    public List<Integer> getSeatIds() {
        return seatIds;
    }

    public void setSeatIds(List<Integer> seatIds) {
        this.seatIds = seatIds;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

