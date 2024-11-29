package ENSF480.uofc.Backend.Seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<SeatDTO> getSeatsByShowtime(int showtimeId) {
        List<Seat> seats = seatRepository.findByShowtimeShowtimeId(showtimeId);
        return seats.stream()
                .map(seat -> new SeatDTO(seat.getSeatId(), seat.getRowNum(), seat.getColumnNumber(), seat.isReserved()))
                .collect(Collectors.toList());
    }
}
