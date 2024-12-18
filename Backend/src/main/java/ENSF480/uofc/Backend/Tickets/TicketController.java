package ENSF480.uofc.Backend.Tickets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * Retrieve tickets for a specific user.
     *
     * @param userId The ID of the user whose tickets are to be retrieved.
     * @return List of tickets for the user.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUser(@PathVariable int userId) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByUserId(userId);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(null);
        }
    }

    /**
     * Refund a ticket by making the seat available and removing the ticket.
     *
     * @param ticketId The ID of the ticket to refund.
     * @return Response indicating the result.
     */
    @DeleteMapping("/{ticketId}/refund")
    public ResponseEntity<?> refundTicket(@PathVariable int ticketId) {
        try {
            ticketService.refundTicket(ticketId);
            return ResponseEntity.ok("Ticket refunded successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("An error occurred while refunding the ticket.");
        }
    }
}
