package ENSF480.uofc.Backend.Movies;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int movieId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String imagePath;

    // Getter for movieId
    public int getMovieId() {
        return movieId;
    }

    // Setter for movieId
    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    // Setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for imagePath
    public String getImagePath() {
        return imagePath;
    }

    // Setter for imagePath
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
