import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { Card, Button, ListGroup, Row } from "react-bootstrap";

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
              <Button onClick={() => navigate(`/tariffs/${user.tariffId}`)}>
                Tariff Info
              </Button>
            </ListGroup.Item>
          )}
        </ListGroup>
        <Row>
          <Button onClick={() => navigate(`/users/${user.id}`)}>
            User Info
          </Button>
          <Button onClick={() => navigate(`/users/edit/${user.id}`)}>
            Edit User
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
}
