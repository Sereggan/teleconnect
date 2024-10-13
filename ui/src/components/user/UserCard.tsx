import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Card, Button, ListGroup, Row, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserCard({ user }: { user: User }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          {user.name} {user.familyName}
        </Card.Title>
        <ListGroup>
          <ListGroup.Item>Phone Number: {user.phoneNumber}</ListGroup.Item>
          <ListGroup.Item>Email: {user.email}</ListGroup.Item>
          <ListGroup.Item>Role: {user.role}</ListGroup.Item>
          {user.tariffId && (
            <ListGroup.Item>
              <Nav.Link
                className="text-primary fw-bold"
                as={Link}
                to={`/tariffs/${user.tariffId}`}
              >
                Tariff Info
              </Nav.Link>
            </ListGroup.Item>
          )}
          <ListGroup.Item className="d-flex justify-content-start">
            <Button
              className="me-2 mt-3"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              User Info
            </Button>
            <Button
              className="mt-3"
              onClick={() => navigate(`/users/edit/${user.id}`)}
            >
              Edit User
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
