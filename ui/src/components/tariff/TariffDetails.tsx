import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTariffById } from "../../services/TariffClient";
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
        try {
          const tariffId = parseInt(id);
          const tariff = await getTariffById(tariffId, controller);
          if (tariff) {
            setTariff(tariff);
          } else {
            setError("Tariff not found");
          }
        } catch (error: any) {
          if (!controller.signal.aborted) {
            setError(error.message || "Error fetching tariff");
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

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && tariff && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Tariff Details</Card.Title>
            <Card.Text>
              <ListGroup>
                <ListGroup.Item>Name: {tariff.name}</ListGroup.Item>
                <ListGroup.Item>Price: {tariff.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {tariff.description}
                </ListGroup.Item>
                <ListGroup.Item>Data Limit: {tariff.dataLimit}</ListGroup.Item>
                <ListGroup.Item>
                  Call Minutes: {tariff.callMinutes}
                </ListGroup.Item>
                <ListGroup.Item>SMS Limit: {tariff.smsLimit}</ListGroup.Item>
                {userRole === UserRole.ROLE_EMPLOYEE && (
                  <ListGroup.Item>
                    Active: {tariff.isActive ? "Yes" : "No"}
                  </ListGroup.Item>
                )}
                {userRole === UserRole.ROLE_EMPLOYEE && (
                  <ListGroup.Item>
                    Is used by users: {tariff.isUsed ? "Yes" : "No"}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
