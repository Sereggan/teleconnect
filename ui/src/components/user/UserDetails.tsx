import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../clients/UserClient";
import { User, UserRole } from "../../models/User";
import { Container, Spinner, Alert, Nav } from "react-bootstrap";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async (abortController: AbortController) => {
      if (id) {
        setIsLoading(true);
        try {
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

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!user) {
    return <Alert variant="warning">User not found</Alert>;
  }

  return (
    <Container>
      <h2>User Details</h2>
      <p>
        <strong>Name:</strong> {user.name} {user.familyName}
      </p>
      <p>
        <strong>Phone Number:</strong> {user.phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Birth date:</strong> {user.birthDate}
      </p>
      {user.role === UserRole.ROLE_CUSTOMER && user.tariffId && (
        <Nav.Link
          className="text-primary fw-bold"
          as={Link}
          to={`/tariffs/${user.tariffId}`}
        >
          Tariff Info
        </Nav.Link>
      )}
    </Container>
  );
}
