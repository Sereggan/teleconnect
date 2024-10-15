package nikolaichuks.teleconnect.backend.repository;

import nikolaichuks.teleconnect.backend.model.ticket.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    List<Ticket> findByUserId(Integer userId);
}
