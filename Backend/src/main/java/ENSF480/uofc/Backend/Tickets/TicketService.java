package ENSF480.uofc.Backend.Tickets;

import ENSF480.uofc.Backend.Seats.Seat;
import ENSF480.uofc.Backend.Seats.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private SeatRepository seatRepository;

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

    /**
     * Refunds a ticket by making the seat available and removing the ticket.
     *
     * @param ticketId The ID of the ticket to refund.
     */
    public void refundTicket(int ticketId) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
        if (!optionalTicket.isPresent()) {
            throw new IllegalArgumentException("Ticket not found.");
        }

        Ticket ticket = optionalTicket.get();

        // Check if the ticket has been redeemed
        if (ticket.isRedeemed()) {
            throw new IllegalArgumentException("Cannot refund a redeemed ticket.");
        }

        // Make the seat available
        Optional<Seat> optionalSeat = seatRepository.findById(ticket.getSeatId());
        if (optionalSeat.isPresent()) {
            Seat seat = optionalSeat.get();
            seat.setReserved(false);
            seat.setUserId(null); // Remove the user from the seat
            seat.setReservedAt(null); // Clear the reservation time
            seatRepository.save(seat);
        }

        // Remove the ticket
        ticketRepository.delete(ticket);
    }
}
