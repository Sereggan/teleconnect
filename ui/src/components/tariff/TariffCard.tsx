import { useNavigate } from "react-router-dom";
import { Tariff } from "../../models/Tariff";
import { Card, Button, ListGroup, Container } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";

export default function TariffCard({ tariff }: { tariff: Tariff }) {
  const userRole = getUserRoleFromToken();
  const navigate = useNavigate();

  return (
    <Container>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{tariff.name}</Card.Title>
          <Card.Text>{tariff.description}</Card.Text>

          <ListGroup>
            <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
            <ListGroup.Item>
              Call minutes: {tariff.callMinutes ?? "Not available"}
            </ListGroup.Item>
            <ListGroup.Item>
              Data limit: {tariff?.dataLimit ?? "Not available"}{" "}
              {tariff.dataLimit && "GB"}
            </ListGroup.Item>
            <ListGroup.Item>
              SMS limit: {tariff?.smsLimit ?? "Not available"}
            </ListGroup.Item>
            <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
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

          <Button
            className="mt-2"
            onClick={() => navigate(`/tariffs/${tariff.id}`)}
          >
            Tariff Info
          </Button>

          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => navigate(`/tariffs/edit/${tariff.id}`)}
            >
              Edit Tariff
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
