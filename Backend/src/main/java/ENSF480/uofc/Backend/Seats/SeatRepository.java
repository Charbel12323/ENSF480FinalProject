package ENSF480.uofc.Backend.Seats;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {

    // Find all seats for a specific showtime
    List<Seat> findByShowtimeShowtimeId(int showtimeId);
}
