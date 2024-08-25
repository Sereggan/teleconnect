import { Link } from "react-router-dom";
import { User, UserRole } from "../../models/User";
import { Card } from "react-bootstrap";

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
        <Link to={`/users/${user.id}`} className="btn btn-primary me-2">
          User Info
        </Link>
        <Link to={`/users/edit/${user.id}`} className="btn btn-secondary">
          Edit User
        </Link>
      </Card.Body>
    </Card>
  );
}
