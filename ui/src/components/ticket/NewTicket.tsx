import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../common/FormInput";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { Ticket } from "../../models/Ticket";
import { createTicket } from "../../clients/TicketClient";
import {
  descriptionValidation,
  titleValidation,
} from "../../validations/modification/ticketValidation";
import { getUserIdFromToken } from "../auth/AuthUtils";
import { FormTextarea } from "../common/FormTextArea";

export default function NewTicket() {
  const methods = useForm<Ticket>();
  const userId = getUserIdFromToken();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const onSubmit = methods.handleSubmit(async (ticket: Ticket) => {
    try {
      setError("");
      const controller = new AbortController();
      controllerRef.current = controller;
      ticket.userId = Number(userId);
      await createTicket(ticket, controller);
      navigate("/tickets");
    } catch (error) {
      console.log(error);
      setError("Error creating ticket");
    }
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <Container>
      <FormProvider {...methods}>
        <Form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="mb-4"
        >
          <Row>
            <Col md={6}>
              <FormInput {...titleValidation} />
            </Col>
          </Row>

          <Row>
            <Col md={9}>
              <FormTextarea {...descriptionValidation} />
            </Col>
          </Row>

          <Row>
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Create Tariff
            </Button>
          </Row>
        </Form>
      </FormProvider>
    </Container>
  );
}
