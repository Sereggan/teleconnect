import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Form,
  Spinner,
  Container,
  Row,
  Col,
  Nav,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import { FormSelect } from "../common/FormSelect";
import { Ticket } from "../../models/Ticket";
import { getTicketById, updateTicket } from "../../clients/TicketClient";
import {
  descriptionValidation,
  idValidation,
  resoltuionValidation,
  ticketStatusValidation,
  titleValidation,
} from "../../validations/modification/ticketValidation";
import { Link } from "react-router-dom";
import { FormTextarea } from "../common/FormTextarea";

export default function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const methods = useForm<Ticket>();

  useEffect(() => {
    const controller = new AbortController();

    const fetchTicket = async () => {
      if (id) {
        setIsLoading(true);
        setError("");
        try {
          const ticketId = parseInt(id);
          const fetchedTicket = await getTicketById(ticketId, controller);
          if (fetchedTicket) {
            setTicket(fetchedTicket);
          } else {
            setError("Ticket not found");
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            console.log(error);
            setError("Error fetching ticket");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTicket();
    return () => controller.abort();
  }, [id]);

  const onSubmit = methods.handleSubmit(async (ticketFilter: Ticket) => {
    if (!ticket) return;
    setIsLoading(true);
    setTicket(ticketFilter);
    const controller = new AbortController();
    try {
      await updateTicket(ticketFilter, controller);
      navigate("/tickets");
    } catch (error) {
      if (!controller.signal.aborted) {
        console.log(error);
        setError("Error updating ticket");
      }
    } finally {
      setIsLoading(false);
      controller.abort();
    }
  });

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

  const ticketAuthor = (
    <Nav.Link
      className="text-primary fw-bold"
      as={Link}
      to={`/users/${ticket?.userId}`}
    >
      User
    </Nav.Link>
  );

  return (
    <Container>
      {!isLoading && !error && (
        <FormProvider {...methods}>
          <Form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            className="mb-4"
          >
            <Form.Text>Ticket for {ticketAuthor}</Form.Text>
            <Row>
              <Col md={6}>
                <FormInput
                  {...idValidation}
                  value={ticket?.id ? ticket?.id : ""}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...{ ...titleValidation, disabled: true }}
                  value={ticket?.title}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormTextarea
                  {...{ ...descriptionValidation, disabled: true }}
                  value={ticket?.description}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormSelect
                  {...ticketStatusValidation}
                  value={ticket?.status ? ticket?.status.toString() : "New"}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormTextarea {...{ ...resoltuionValidation }} />
              </Col>
            </Row>
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Update ticket
            </Button>
          </Form>
        </FormProvider>
      )}
    </Container>
  );
}
