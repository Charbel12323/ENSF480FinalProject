package ENSF480.uofc.Backend.Movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import ENSF480.uofc.Backend.Movies.MovieDTO;
import ENSF480.uofc.Backend.Showtime.ShowtimeDTO;
import ENSF480.uofc.Backend.Movies.Movie;
import ENSF480.uofc.Backend.Movies.MovieRepository;
import ENSF480.uofc.Backend.Showtime.Showtime;
import ENSF480.uofc.Backend.Theatre.Theatre;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Transactional
    public List<MovieDTO> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();

        return movies.stream().map(movie -> {
            MovieDTO movieDTO = new MovieDTO();
            movieDTO.setMovieId(movie.getMovieId());
            movieDTO.setTitle(movie.getTitle());
            movieDTO.setDescription(movie.getDescription());
            movieDTO.setImagePath(movie.getImagePath());

            // Initialize showtimes if they are fetched
            if (movie.getShowtimes() != null && !movie.getShowtimes().isEmpty()) {
                List<ShowtimeDTO> showtimeDTOs = movie.getShowtimes().stream().map(showtime -> {
                    ShowtimeDTO showtimeDTO = new ShowtimeDTO();
                    showtimeDTO.setShowtimeId(showtime.getShowtimeId());
                    showtimeDTO.setTheatreName(showtime.getTheatre().getName());
                    showtimeDTO.setTheatrePlace(showtime.getTheatre().getPlace());
                    showtimeDTO.setShowtime(showtime.getShowtime());
                    return showtimeDTO;
                }).collect(Collectors.toList());

                movieDTO.setShowtimes(showtimeDTOs);
            } else {
                movieDTO.setShowtimes(null);
            }

            return movieDTO;
        }).collect(Collectors.toList());
    }

    @Transactional
    public MovieDTO getMovieById(int movieId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        MovieDTO movieDTO = new MovieDTO();
        movieDTO.setMovieId(movie.getMovieId());
        movieDTO.setTitle(movie.getTitle());
        movieDTO.setDescription(movie.getDescription());
        movieDTO.setImagePath(movie.getImagePath());

        if (movie.getShowtimes() != null && !movie.getShowtimes().isEmpty()) {
            List<ShowtimeDTO> showtimeDTOs = movie.getShowtimes().stream().map(showtime -> {
                ShowtimeDTO showtimeDTO = new ShowtimeDTO();
                showtimeDTO.setShowtimeId(showtime.getShowtimeId());
                showtimeDTO.setTheatreName(showtime.getTheatre().getName());
                showtimeDTO.setTheatrePlace(showtime.getTheatre().getPlace());
                showtimeDTO.setShowtime(showtime.getShowtime());
                return showtimeDTO;
            }).collect(Collectors.toList());

            movieDTO.setShowtimes(showtimeDTOs);
        } else {
            movieDTO.setShowtimes(null);
        }

        return movieDTO;
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }
}
