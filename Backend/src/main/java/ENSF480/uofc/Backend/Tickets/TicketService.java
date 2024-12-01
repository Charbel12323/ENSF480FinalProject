package ENSF480.uofc.Backend.Tickets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * Creates tickets for a list of seat IDs.
     *
     * @param seatIds    List of seat IDs.
     * @param showtimeId Showtime ID for the tickets.
     * @param userId     User ID who is purchasing the tickets.
     */
    public void createTicketsForSeats(List<Integer> seatIds, int showtimeId, int userId) {
        for (Integer seatId : seatIds) {
            Ticket ticket = new Ticket();
            ticket.setSeatId(seatId);
            ticket.setShowtimeId(showtimeId);
            ticket.setUserId(userId);
            ticket.setRedeemed(false); // By default, the ticket is not redeemed
            ticket.setPurchaseDate(LocalDateTime.now());

            ticketRepository.save(ticket);
        }
    }

    /**
     * Retrieves tickets for a specific user.
     *
     * @param userId The ID of the user whose tickets are being retrieved.
     * @return List of tickets associated with the user.
     */
    public List<Ticket> getTicketsByUserId(int userId) {
        return ticketRepository.findAllByUserId(userId);
    }
}
