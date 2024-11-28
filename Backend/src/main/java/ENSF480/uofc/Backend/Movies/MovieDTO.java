package ENSF480.uofc.Backend.Movies;

import java.util.List;

import ENSF480.uofc.Backend.Showtime.ShowtimeDTO;

public class MovieDTO {
    private int movieId;
    private String title;
    private String description;
    private String imagePath;
    private List<ShowtimeDTO> showtimes;

    // Constructors
    public MovieDTO() {
    }

    public MovieDTO(int movieId, String title, String description, String imagePath, List<ShowtimeDTO> showtimes) {
        this.movieId = movieId;
        this.title = title;
        this.description = description;
        this.imagePath = imagePath;
        this.showtimes = showtimes;
    }

    // Getters and Setters
    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public List<ShowtimeDTO> getShowtimes() {
        return showtimes;
    }

    public void setShowtimes(List<ShowtimeDTO> showtimes) {
        this.showtimes = showtimes;
    }
}
