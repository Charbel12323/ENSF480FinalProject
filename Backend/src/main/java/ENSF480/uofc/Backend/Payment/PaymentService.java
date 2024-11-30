package ENSF480.uofc.Backend.Payment;

import ENSF480.uofc.Backend.Seats.Seat;
import ENSF480.uofc.Backend.Seats.SeatRepository;
import ENSF480.uofc.Backend.Ticket.Ticket;
import ENSF480.uofc.Backend.Ticket.TicketRepository;
import ENSF480.uofc.Backend.users.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = "sk_test_51QQgDtDUKjAvOoW4eoccwianifHzGXwRzf1e4eckm48dl0OINMEA4QPAuSU8q5r8JvLREzL5IB0ZfWNZN9z7J6Mv00KlUW91N9"; // Replace
                                                                                                                                       // with
                                                                                                                                       // Stripe
                                                                                                                                       // Secret
                                                                                                                                       // Key
    }

    public Map<String, Object> createPaymentIntent(PaymentRequest paymentRequest) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean userExists = userRepository.existsById(paymentRequest.getUserId());
            if (!userExists) {
                throw new RuntimeException("User ID " + paymentRequest.getUserId() + " does not exist");
            }

            Map<String, Object> params = new HashMap<>();
            params.put("amount", paymentRequest.getAmount());
            params.put("currency", paymentRequest.getCurrency());
            params.put("payment_method_types", List.of("card"));

            PaymentIntent intent = PaymentIntent.create(params);

            Payment payment = new Payment();
            payment.setPaymentNumber(intent.getId());
            payment.setAmount(paymentRequest.getAmount() / 100.0);
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

        for (int seatId : request.getSeatIds()) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found with ID: " + seatId));

            seat.setReserved(true);
            seatRepository.save(seat);

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
