import { Link } from "react-router-dom";
import { Tariff } from "../../models/Tariff";
import { Card, Button } from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";
import { UserRole } from "../../models/User";

export default function TariffCard({ tariff }: { tariff: Tariff }) {
  const userRole = getUserRoleFromToken();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{tariff.name}</Card.Title>
        <Card.Text>{tariff.description}</Card.Text>
        <ul className="list-unstyled">
          <li>
            <strong>Price:</strong> {tariff.price} Euro
          </li>
          <li>
            <strong>Call minutes:</strong> {tariff.callMinutes ?? "Unlimited"}
          </li>
          <li>
            <strong>Data limit(MB):</strong> {tariff?.dataLimit ?? "Unlimited"}
          </li>
          <li>
            <strong>SMS limit:</strong> {tariff?.smsLimit ?? "Unlimited"}
          </li>
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <li>
              <strong>Active:</strong> {tariff.isActive ? "Yes" : "No"}
            </li>
          )}
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <li>
              <strong>Is used by users:</strong> {tariff.isUsed ? "Yes" : "No"}
            </li>
          )}
        </ul>
        <Link to={`/tariffs/${tariff.id}`}>
          <Button variant="primary" className="me-2">
            Tariff Info
          </Button>
        </Link>
        {userRole === UserRole.ROLE_EMPLOYEE && (
          <Link to={`/tariffs/edit/${tariff.id}`}>
            <Button variant="secondary">Edit Tariff</Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
