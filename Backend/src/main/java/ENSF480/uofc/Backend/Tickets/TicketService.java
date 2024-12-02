package ENSF480.uofc.Backend.Tickets;

import ENSF480.uofc.Backend.Seats.Seat;
import ENSF480.uofc.Backend.Seats.SeatRepository;
import ENSF480.uofc.Backend.users.User;
import ENSF480.uofc.Backend.users.UserService;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private UserService userService;

    private final SendGrid sendGrid;
    private final String sendGridApiKey;

    public TicketService() {
        Dotenv dotenv = Dotenv.configure().directory("src/main/resources").filename(".env").load();
        this.sendGridApiKey = dotenv.get("SENDGRID_API_KEY");
        this.sendGrid = new SendGrid(sendGridApiKey);
    }

    /**
     * Creates tickets for a list of seat IDs.
     *
     * @param seatIds    List of seat IDs.
     * @param showtimeId Showtime ID for the tickets.
     * @param userId     User ID who is purchasing the tickets.
     */
    public void createTicketsForSeats(java.util.List<Integer> seatIds, int showtimeId, int userId) {
        for (Integer seatId : seatIds) {
            Ticket ticket = new Ticket();
            ticket.setSeatId(seatId);
            ticket.setShowtimeId(showtimeId);
            ticket.setUserId(userId);
            ticket.setRedeemed(false); // By default, the ticket is not redeemed
            ticket.setPurchaseDate(java.time.LocalDateTime.now());

            ticketRepository.save(ticket);
        }
    }

    /**
     * Retrieves tickets for a specific user.
     *
     * @param userId The ID of the user whose tickets are being retrieved.
     * @return List of tickets associated with the user.
     */
    public java.util.List<Ticket> getTicketsByUserId(int userId) {
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

        // Send refund confirmation email
        sendRefundConfirmationEmail(ticket);
    }

    private void sendRefundConfirmationEmail(Ticket ticket) {
        try {
            // Get user details
            User user = userService.getUserById(ticket.getUserId());
            if (user == null) {
                System.out.println("User not found for ticket ID: " + ticket.getTicketId());
                return;
            }

            String recipientEmail = user.getEmail();
            String recipientName = user.getName() != null ? user.getName() : "Valued Customer";

            String subject = "Your Ticket Refund Confirmation";
            String contentText = String.format(
                    "Hello %s,\n\n" +
                            "Your refund for ticket ID %d has been processed successfully.\n" +
                            "We hope to see you again soon!\n\n" +
                            "Best regards,\nThe Cinema Team",
                    recipientName,
                    ticket.getTicketId());

            Email from = new Email("mcharbel439@gmail.com"); // Replace with your verified sender email
            Email to = new Email(recipientEmail);
            Content content = new Content("text/plain", contentText);
            Mail mail = new Mail(from, subject, to, content);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 400) {
                System.out.println("Failed to send refund email. Status code: " + response.getStatusCode());
            } else {
                System.out.println("Refund email sent successfully to " + recipientEmail);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error sending refund confirmation email: " + e.getMessage());
        }
    }
}