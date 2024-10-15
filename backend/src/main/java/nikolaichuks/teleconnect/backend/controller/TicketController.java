package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.ticket.api.TicketApi;
import teleconnect.ticket.model.TicketDto;
import teleconnect.ticket.model.TicketListResponse;

@RestController
@RequiredArgsConstructor
public class TicketController implements TicketApi {

    private final TicketService ticketService;

    @Override
    public ResponseEntity<TicketDto> createTicket(TicketDto ticketDto) {
        return new ResponseEntity<>(ticketService.createTicket(ticketDto), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<TicketDto> getTicketById(Integer id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @Override
    public ResponseEntity<TicketListResponse> getTicketsByUserId(Integer userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    @Override
    public ResponseEntity<TicketDto> updateTicket(TicketDto ticketDto) {
        return ResponseEntity.ok(ticketService.updateTicket(ticketDto));
    }
}
