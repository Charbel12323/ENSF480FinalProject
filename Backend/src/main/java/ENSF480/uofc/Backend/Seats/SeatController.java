package ENSF480.uofc.Backend.Seats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/{showtimeId}")
    public List<SeatDTO> getSeatsByShowtime(@PathVariable int showtimeId) {
        return seatService.getSeatsByShowtime(showtimeId);
    }

    @PostMapping("/book")
    public ResponseEntity<String> bookSeats(@RequestBody SeatBookingRequest request) {
        try {
            seatService.bookSeats(request.getSeatIds(), request.getUserId(), request.getEmail());
            return ResponseEntity.ok("Seats booked successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error booking seats: " + e.getMessage());
        }
    }

    @PostMapping("/release")
    public ResponseEntity<String> releaseSeats(@RequestBody List<Integer> seatIds) {
        try {
            seatService.releaseSeats(seatIds);
            return ResponseEntity.ok("Seats released successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error releasing seats: " + e.getMessage());
        }
    }
}
