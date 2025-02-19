import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTariffById } from "../../clients/TariffClient";
import { Tariff } from "../../models/Tariff";
import { Container, Spinner, Alert, Card, ListGroup } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";

export default function TariffDetails() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const userRole = getUserRoleFromToken();

  useEffect(() => {
    const fetchTariff = async (controller: AbortController) => {
      if (id) {
        setIsLoading(true);
        setError("");
        try {
          const tariffId = parseInt(id);
          const tariff = await getTariffById(tariffId, controller);
          if (tariff) {
            setTariff(tariff);
          } else {
            setError("Tariff not found");
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            setError("Error fetching tariff");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    controllerRef.current = new AbortController();
    fetchTariff(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
  }, [id]);

  if (error) {
    return <Alert variant="danger">Something went wrong.</Alert>;
  }

  if (isLoading) {
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>;
  }

  return (
    <Container>
      {!isLoading && !error && tariff && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Tariff Details</Card.Title>

            <ListGroup>
              <ListGroup.Item>Name: {tariff.name}</ListGroup.Item>
              <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
              <ListGroup.Item>Description: {tariff.description}</ListGroup.Item>
              <ListGroup.Item>
                Data Limit:{" "}
                {tariff.dataLimit ? tariff.dataLimit + " GB" : "Unlimited"}
              </ListGroup.Item>
              <ListGroup.Item>
                Call Minutes:{" "}
                {tariff.callMinutes ? tariff.callMinutes : "Unlimited"}
              </ListGroup.Item>
              <ListGroup.Item>
                SMS Limit: {tariff.smsLimit ? tariff.smsLimit : "Unlimited"}
              </ListGroup.Item>
              {userRole === UserRole.ROLE_EMPLOYEE && (
                <ListGroup.Item>
                  Active: {tariff.isActive ? "Yes" : "No"}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
