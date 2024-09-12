import { useNavigate } from "react-router-dom";
import { Tariff } from "../../models/Tariff";
import { Card, Button, ListGroup } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";

export default function TariffCard({ tariff }: { tariff: Tariff }) {
  const userRole = getUserRoleFromToken();
  const navigate = useNavigate();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{tariff.name}</Card.Title>
        <Card.Text>{tariff.description}</Card.Text>
        <Card.Text>
          <Card.Text>
            <ListGroup>
              <ListGroup.Item>Price: {tariff.price} Euro</ListGroup.Item>
              <ListGroup.Item>
                Call minutes:{tariff.callMinutes ?? "Unlimited"}
              </ListGroup.Item>
              <ListGroup.Item>
                Data limit(MB): {tariff?.dataLimit ?? "Unlimited"} GB
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
              {userRole === UserRole.ROLE_EMPLOYEE && (
                <ListGroup.Item>
                  Is used by users: {tariff.isUsed ? "Yes" : "No"}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Text>
        </Card.Text>

        <Button onClick={() => navigate(`/tariffs/${tariff.id}`)}>
          Tariff Info
        </Button>

        {userRole === UserRole.ROLE_EMPLOYEE && (
          <Button
            variant="secondary"
            onClick={() => navigate(`/tariffs/edit/${tariff.id}`)}
          >
            Edit Tariff
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
