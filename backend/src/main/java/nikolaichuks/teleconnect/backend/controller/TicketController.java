package nikolaichuks.teleconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.service.TicketService;
import nikolaichuks.teleconnect.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import teleconnect.ticket.api.TicketApi;
import teleconnect.ticket.model.PaginatedTicketResponse;
import teleconnect.ticket.model.TicketDto;
import teleconnect.ticket.model.TicketListResponse;

@RestController
@RequiredArgsConstructor
public class TicketController implements TicketApi {

    private final AuthUtil authUtil;
    private final TicketService ticketService;

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TicketDto> createTicket(TicketDto ticketDto) {
        if (authUtil.hasEmployeeRoleOrEqualToUserId(ticketDto.getUserId().toString())) {
            return new ResponseEntity<>(ticketService.createTicket(ticketDto), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TicketDto> getTicketById(Integer id) {
        if (authUtil.hasEmployeeRole()) {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<PaginatedTicketResponse> listTickets(String status, Integer limit, Integer offset) {
        if (authUtil.hasEmployeeRole()) {
            return ResponseEntity.ok(ticketService.listTickets(status, limit, offset));
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TicketListResponse> getTicketsByUserId(Integer userId) {
        if (authUtil.hasEmployeeRoleOrEqualToUserId(userId.toString())) {
            return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /*
     * {@inheritDoc}
     */
    @Override
    public ResponseEntity<TicketDto> updateTicket(TicketDto ticketDto) {
        return ResponseEntity.ok(ticketService.updateTicket(ticketDto));

    }

}
