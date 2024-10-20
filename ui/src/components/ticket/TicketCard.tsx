import { useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";
import { Ticket, TicketStatus } from "../../models/Ticket";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const userRole = getUserRoleFromToken();
  const navigate = useNavigate();

  const cardStyle = (() => {
    switch (ticket.status) {
      case TicketStatus.Resolved:
        return { backgroundColor: "#d4edda", borderColor: "#c3e6cb" };
      case TicketStatus.Rejected:
        return { backgroundColor: "#f8d7da", borderColor: "#f5c6cb" };
      default:
        return {};
    }
  })();

  return (
    <Container>
      <Card className="mb-3" style={cardStyle}>
        <Card.Body>
          <Card.Title>{ticket.title}</Card.Title>
          <Card.Text>{ticket.description}</Card.Text>
          <Card.Text>Status: {ticket.status}</Card.Text>
          {ticket.resolution && (
            <Card.Text>Resultion: {ticket.status}</Card.Text>
          )}
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
            >
              Edit ticket
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
