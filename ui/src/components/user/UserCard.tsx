import { Link } from "react-router-dom";
import { User, UserRole } from "../../models/User";
import { Card, Button } from "react-bootstrap";

export default function UserCard({ user }: { user: User }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          {user.name} {user.surname}
        </Card.Title>
        <Card.Text>
          <ul className="list-unstyled">
            <li>
              <strong>Phone Number:</strong> {user.phoneNumber}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>Role:</strong> {user.role}
            </li>
            {user.role === UserRole.ROLE_CUSTOMER && user.tariffId && (
              <Link to={`/tariffs/${user.tariffId}`}>Tariff Info</Link>
            )}
          </ul>
        </Card.Text>
        <Link to={`/users/${user.id}`}>
          <Button variant="primary" className="me-2">
            User Info
          </Button>
        </Link>
        <Link to={`/users/edit/${user.id}`}>
          <Button variant="secondary">Edit User</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
