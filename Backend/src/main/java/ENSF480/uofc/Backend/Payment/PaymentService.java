package ENSF480.uofc.Backend.Payment;

import ENSF480.uofc.Backend.Seats.Seat;
import ENSF480.uofc.Backend.Seats.SeatRepository;
import ENSF480.uofc.Backend.Ticket.Ticket;
import ENSF480.uofc.Backend.Ticket.TicketRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = "sk_test_YourStripeSecretKey"; // Replace with your actual secret key
    }

    public Map<String, Object> createPaymentIntent(PaymentRequest paymentRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("amount", paymentRequest.getAmount());
            params.put("currency", paymentRequest.getCurrency());
            params.put("payment_method_types", List.of("card"));

            PaymentIntent intent = PaymentIntent.create(params);

            Payment payment = new Payment();
            payment.setPaymentNumber(intent.getId());
            payment.setAmount(paymentRequest.getAmount() / 100.0); // Convert cents to dollars
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setPaymentStatus("pending");
            payment.setPaymentDate(LocalDate.now());
            payment.setUserId(paymentRequest.getUserId());
            paymentRepository.save(payment);

            response.put("clientSecret", intent.getClientSecret());
        } catch (StripeException e) {
            response.put("error", e.getMessage());
        }
        return response;
    }

    public String confirmBooking(ConfirmBookingRequest request) {
        Payment latestPayment = paymentRepository.findTopByUserIdOrderByPaymentIdDesc(request.getUserId())
                .orElseThrow(() -> new RuntimeException("No payment found for user ID: " + request.getUserId()));

        for (Integer seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found with ID: " + seatId));

            if (seat.isReserved()) {
                throw new RuntimeException("Seat is already reserved: " + seatId);
            }

            // Reserve the seat
            seat.setReserved(true);
            seatRepository.save(seat);

            // Create a ticket for the reserved seat
            Ticket ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setShowtime(seat.getShowtime());
            ticket.setUserId(request.getUserId());
            ticket.setPaymentId(latestPayment.getPaymentId());
            ticket.setRedeemed(false);
            ticketRepository.save(ticket);
        }

        latestPayment.setPaymentStatus("succeeded");
        paymentRepository.save(latestPayment);

        return "Booking Confirmed!";
    }
}
