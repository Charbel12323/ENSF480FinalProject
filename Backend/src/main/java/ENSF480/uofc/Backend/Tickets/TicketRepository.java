package ENSF480.uofc.Backend.Tickets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    /**
     * Find all tickets for a specific user.
     *
     * @param userId The ID of the user.
     * @return List of tickets.
     */
    List<Ticket> findAllByUserId(int userId);
}
