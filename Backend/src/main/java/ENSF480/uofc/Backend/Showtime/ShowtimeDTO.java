package ENSF480.uofc.Backend.Showtime;

import java.time.LocalDateTime;

public class ShowtimeDTO {
    private int showtimeId;
    private String theatreName;
    private String theatrePlace;
    private LocalDateTime showtime;

    // Constructors
    public ShowtimeDTO() {
    }

    public ShowtimeDTO(int showtimeId, String theatreName, String theatrePlace, LocalDateTime showtime) {
        this.showtimeId = showtimeId;
        this.theatreName = theatreName;
        this.theatrePlace = theatrePlace;
        this.showtime = showtime;
    }

    // Getters and Setters
    public int getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(int showtimeId) {
        this.showtimeId = showtimeId;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getTheatrePlace() {
        return theatrePlace;
    }

    public void setTheatrePlace(String theatrePlace) {
        this.theatrePlace = theatrePlace;
    }

    public LocalDateTime getShowtime() {
        return showtime;
    }

    public void setShowtime(LocalDateTime showtime) {
        this.showtime = showtime;
    }
}
