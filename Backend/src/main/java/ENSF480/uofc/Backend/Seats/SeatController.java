package ENSF480.uofc.Backend.Seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/{showtimeId}")
    public List<SeatDTO> getSeatsByShowtime(@PathVariable int showtimeId) {
        return seatService.getSeatsByShowtime(showtimeId);
    }
}
