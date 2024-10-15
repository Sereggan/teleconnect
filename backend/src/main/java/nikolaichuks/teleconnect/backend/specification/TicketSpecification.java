package nikolaichuks.teleconnect.backend.specification;

import nikolaichuks.teleconnect.backend.model.ticket.Ticket;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class TicketSpecification {

    public Specification<Ticket> getTicketSpecification(String status) {
        Specification<Ticket> spec = Specification.where(null);
        if(status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), Ticket.Status.valueOf(status)));
        }
    }
}
