package ENSF480.uofc.Backend.Seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.Date;
import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<SeatDTO> getSeatsByShowtime(int showtimeId) {
        List<Seat> seats = seatRepository.findByShowtimeShowtimeId(showtimeId);
        return seats.stream()
                .map(seat -> new SeatDTO(seat.getSeatId(), seat.getRowNum(), seat.getColumnNumber(),
                        seat.isReserved(), seat.getUserId() != null ? seat.getUserId() : 0))
                .collect(Collectors.toList());
    }

    @Transactional
    public void bookSeats(List<Integer> seatIds, int userId, String email) {
        List<Seat> seats = seatRepository.findAllById(seatIds);

        // Verify no seats are already taken
        for (Seat seat : seats) {
            if (seat.isReserved() || seat.getUserId() != null) {
                throw new IllegalStateException("One or more seats are already reserved!");
            }
        }

        // Book all seats
        for (Seat seat : seats) {
            seat.setReserved(true);
            seat.setUserId(userId);
            seat.setReservedAt(new Date());
        }

        seatRepository.saveAll(seats);
    }

    @Transactional
    public void releaseSeats(List<Integer> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);

        for (Seat seat : seats) {
            seat.setReserved(false);
            seat.setUserId(null);
            seat.setReservedAt(null);
        }

        seatRepository.saveAll(seats);
    }
}