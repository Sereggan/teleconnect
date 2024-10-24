import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../clients/UserClient";
import { User, UserRole } from "../../models/User";
import {
  Container,
  Spinner,
  Alert,
  Nav,
  Card,
  ListGroup,
} from "react-bootstrap";
import { getUserRoleFromToken } from "../auth/AuthUtils";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUserRole: string | null = getUserRoleFromToken();

  useEffect(() => {
    const fetchUser = async (abortController: AbortController) => {
      if (id) {
        setIsLoading(true);
        try {
          setError("");
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, abortController);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            setError("User not found");
          }
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.log(error);
            setError("Error fetching user");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    const abortController = new AbortController();
    fetchUser(abortController);
    return () => abortController.abort();
  }, [id]);

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (!user) {
    return <Alert variant="warning">User not found</Alert>;
  }

  return (
    <Container>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>User Details</Card.Title>
          <ListGroup>
            <ListGroup.Item>Name: {user.name}</ListGroup.Item>
            <ListGroup.Item>Familyname: {user.familyName}</ListGroup.Item>
            <ListGroup.Item>Phone Number: {user.phoneNumber}</ListGroup.Item>
            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
            <ListGroup.Item>Birh date: {user.birthDate}</ListGroup.Item>
            {currentUserRole === UserRole.ROLE_EMPLOYEE && (
              <ListGroup.Item>Role: {user.role}</ListGroup.Item>
            )}
            {currentUserRole === UserRole.ROLE_CUSTOMER && !user.tariffId && (
              <p>No active tariffs.</p>
            )}
            {user.tariffId && (
              <ListGroup.Item>
                <Nav.Link
                  className="text-primary fw-bold"
                  as={Link}
                  to={`/users/${user.id}/tariff`}
                >
                  Tariff
                </Nav.Link>
              </ListGroup.Item>
            )}
            {currentUserRole === UserRole.ROLE_EMPLOYEE && (
              <ListGroup.Item>
                <Nav.Link
                  className="text-primary fw-bold"
                  as={Link}
                  to={`/users/${user.id!}/edit/documents`}
                >
                  Documents
                </Nav.Link>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}
