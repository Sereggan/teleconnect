package nikolaichuks.teleconnect.backend.service;

import lombok.RequiredArgsConstructor;
import nikolaichuks.teleconnect.backend.exception.CustomRestException;
import nikolaichuks.teleconnect.backend.mapper.MapperUtil;
import nikolaichuks.teleconnect.backend.model.ticket.Ticket;
import nikolaichuks.teleconnect.backend.repository.TicketRepository;
import nikolaichuks.teleconnect.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import teleconnect.ticket.model.TicketDto;
import teleconnect.ticket.model.TicketListResponse;

import java.util.List;

/**
 * Ticket service
 */
@Service
@RequiredArgsConstructor
public class TicketService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final MapperUtil mapperUtil;

    public TicketDto createTicket(TicketDto ticketDto) {
        return userRepository.findById(ticketDto.getUserId())
                .map(user -> {
                    Ticket ticket = mapperUtil.mapTicketDtoToTicket(ticketDto);
                    ticket.setUser(user);
                    return mapperUtil.mapTicketToTicketDto(ticketRepository.save(ticket));
                })
                .orElseThrow(() -> new CustomRestException("User not found", HttpStatus.NOT_FOUND));
    }

    public TicketDto getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(mapperUtil::mapTicketToTicketDto)
                .orElseThrow(() -> new CustomRestException("Ticket not found", HttpStatus.NOT_FOUND));
    }

    public TicketListResponse getTicketsByUserId(Integer userId) {
        List<TicketDto> tickets = ticketRepository.findByUserId(userId).stream()
                .map(mapperUtil::mapTicketToTicketDto)
                .toList();

        TicketListResponse ticketListResponse = new TicketListResponse();
        ticketListResponse.setTickets(tickets);
        return ticketListResponse;
    }

    public TicketDto updateTicket(TicketDto ticketDto) {
        return ticketRepository.findById(ticketDto.getId())
                .map(ticket -> {
                    Ticket updatedTicket = mapperUtil.mapTicketDtoToTicket(ticketDto, ticket);
                    updatedTicket.setUser(ticket.getUser());
                    return mapperUtil.mapTicketToTicketDto(ticketRepository.save(updatedTicket));
                })
                .orElseThrow(() -> new CustomRestException("Ticket not found", HttpStatus.NOT_FOUND));
    }
}
