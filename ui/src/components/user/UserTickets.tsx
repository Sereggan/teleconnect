import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../clients/UserClient";
import {
  Container,
  Spinner,
  Alert,
  Nav,
  Card,
  ListGroup,
  Row,
  Col,
} from "react-bootstrap";
import { Ticket } from "../../models/Ticket";
import { getTicketsByUserId } from "../../clients/TicketClient";
import TicketCard from "../ticket/TicketCard";

export default function UserTickets() {
  const { id } = useParams<{ id: string }>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async (abortController: AbortController) => {
      if (id) {
        setIsLoading(true);
        try {
          setError("");
          const userId = parseInt(id);
          const fetchedTickets = await getTicketsByUserId(
            userId,
            abortController
          );
          if (fetchedTickets) {
            setTickets(fetchedTickets);
          } else {
            setTickets([]);
          }
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.log(error);
            setError("Error fetching user");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    const abortController = new AbortController();
    fetchTickets(abortController);
    return () => abortController.abort();
  }, [id]);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container>
      <Row>
        {tickets.length === 0 ? (
          <Col>
            <p>No tickets.</p>
          </Col>
        ) : (
          tickets.map((ticket) => (
            <Col key={ticket.id} md={4}>
              <Col key={ticket.id} md={4}>
                <TicketCard ticket={ticket} />
              </Col>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
