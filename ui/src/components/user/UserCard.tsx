import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Card, Button, ListGroup } from "react-bootstrap";

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
          <ListGroup.Item>Birth date: {user.birthDate}</ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-start">
            <Button
              className="me-2 mt-3"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              User Info
            </Button>
            <Button
              className="mt-3"
              onClick={() => navigate(`/users/${user.id}/edit`)}
            >
              Edit User
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
