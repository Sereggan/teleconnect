import { useNavigate } from "react-router-dom";
import { Tariff } from "../../models/Tariff";
import { Card, Button, ListGroup, Container } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";

export default function TariffCard({ tariff }: { tariff: Tariff }) {
  const userRole = getUserRoleFromToken();
  const navigate = useNavigate();

  const cardStyle = tariff.isActive
    ? {}
    : { backgroundColor: "#f8d7da", borderColor: "#f5c6cb" };

  return (
    <Container>
      <Card className="mb-3" style={cardStyle}>
        <Card.Body>
          <Card.Title>{tariff.name}</Card.Title>
          <Card.Text>{tariff.description}</Card.Text>

          <ListGroup>
            <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
            <ListGroup.Item>
              Call minutes: {tariff.callMinutes ?? "Unlimited"}
            </ListGroup.Item>
            <ListGroup.Item>
              Data limit: {tariff?.dataLimit ?? "Unlimited"}{" "}
              {tariff.dataLimit && "GB"}
            </ListGroup.Item>
            <ListGroup.Item>
              SMS limit: {tariff?.smsLimit ?? "Unlimited"}
            </ListGroup.Item>
            <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
            {userRole === UserRole.ROLE_EMPLOYEE && (
              <ListGroup.Item>
                Active: {tariff.isActive ? "Yes" : "No"}
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
              className="mt-2 mx-2"
              variant="secondary"
              onClick={() => navigate(`/tariffs/${tariff.id}/edit`)}
            >
              Edit Tariff
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
