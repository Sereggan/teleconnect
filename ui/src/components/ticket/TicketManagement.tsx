import { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";

import { FormProvider, useForm } from "react-hook-form";
import { FormSelect } from "../common/FormSelect";
import { Ticket, TicketStatus } from "../../models/Ticket";
import { getAllTickets } from "../../clients/TicketClient";
import { ticketStatusValidation } from "../../validations/filtering/ticketValidations";
import TicketCard from "./TicketCard";

interface Filters {
  status: TicketStatus;
}

export default function TicketManagment() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketsList, setTicketsList] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<Filters>({
    status: TicketStatus.New,
  });

  const isMountedRef = useRef(true);
  const methods = useForm<Filters>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTickets = async (
    page = 0,
    controller: AbortController,
    { status }: Filters
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const { tickets, totalPages, currentPage } = await getAllTickets(
        {
          status,
          limit: 10,
          offset: page,
        },
        controller
      );

      setTicketsList(tickets ?? []);
      setPagination({
        currentPage,
        totalPages,
      });
    } catch (error) {
      if (!controller.signal.aborted) {
        console.log(error);
        setError("Could not load tickets.");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const onSubmit = methods.handleSubmit((data: Filters) => {
    const controller = new AbortController();
    setFilters(data);
    fetchTickets(0, controller, data);
    return () => {
      controller.abort();
    };
  });

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchTickets(page, controller, filters);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTickets(pagination.currentPage, controller, filters);

    return () => {
      controller.abort();
    };
  }, []);

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
            <Col md={3}>
              <FormSelect {...ticketStatusValidation} />
            </Col>
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Search Tickets
            </Button>
          </Row>
        </Form>
      </FormProvider>
      {error && <div>Something went wrong, please try again... {error}</div>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
        <>
          <Row>
            {ticketsList.length === 0 ? (
              <Col>
                <p>No tickets available.</p>
              </Col>
            ) : (
              ticketsList.map((ticket) => (
                <Col key={ticket.id} md={4}>
                  <TicketCard ticket={ticket} />
                </Col>
              ))
            )}
          </Row>

          {pagination.totalPages > 1 && (
            <Pagination>
              {[...Array(pagination.totalPages)].map(
                (_, i) =>
                  Math.abs(i - pagination.currentPage) <= 2 && (
                    <Pagination.Item
                      key={i}
                      active={i === pagination.currentPage}
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  )
              )}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}
