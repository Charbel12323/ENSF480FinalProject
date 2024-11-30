package ENSF480.uofc.Backend.Seats;

public class SeatDTO {
    private int seatId;
    private String rowNum;
    private int columnNumber;
    private boolean isReserved;
    private int userId;
    // Constructors
    public SeatDTO() {
    }

    public SeatDTO(int seatId, String rowNum, int columnNumber, boolean isReserved, int userId) {
        this.seatId = seatId;
        this.rowNum = rowNum;
        this.columnNumber = columnNumber;
        this.isReserved = isReserved;
        this.userId = userId;
    }

    // Getters and Setters
    public int getSeatId() {
        return seatId;
    }

    public void setSeatId(int seatId) {
        this.seatId = seatId;
    }

    public String getRowNum() {
        return rowNum;
    }

    public void setRowNum(String rowNum) {
        this.rowNum = rowNum;
    }

    public int getColumnNumber() {
        return columnNumber;
    }

    public void setColumnNumber(int columnNumber) {
        this.columnNumber = columnNumber;
    }

    public boolean isReserved() {
        return isReserved;
    }

    public void setReserved(boolean reserved) {
        isReserved = reserved;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
