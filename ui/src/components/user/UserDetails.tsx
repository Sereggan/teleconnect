import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../clients/UserClient";
import { User } from "../../models/User";
import {
  Container,
  Spinner,
  Alert,
  Nav,
  Card,
  ListGroup,
} from "react-bootstrap";
import { Tariff } from "../../models/Tariff";
import { TariffAdjustment } from "../../models/TariffAdjustment";
import { getTariffById } from "../../clients/TariffClient";
import { getTariffAdjustment } from "../../clients/TariffAdjustmentClient";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [tariff, setTariff] = useState<Tariff>();
  const [tariffAdjustment, setTariffAdjustment] = useState<TariffAdjustment>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchTariff = async (abortController: AbortController) => {
      if (user?.tariffId) {
        try {
          const fetchedTariff = await getTariffById(
            user.tariffId,
            abortController
          );
          setTariff(fetchedTariff);
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.log(error);
            setError("Error fetching tariff");
          }
        }
      }
    };

    const fetchTariffAdjustment = async (abortController: AbortController) => {
      if (user?.tariffAdjustmentId) {
        try {
          const fetchedTariffAdjustment = await getTariffAdjustment(
            user.tariffAdjustmentId,
            abortController
          );
          setTariffAdjustment(fetchedTariffAdjustment);
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.log(error);
            setError("Error fetching tariff adjustment");
          }
        }
      }
    };

    const abortController = new AbortController();
    setIsLoading(true);

    fetchTariff(abortController);
    fetchTariffAdjustment(abortController);
    setIsLoading(false);

    return () => abortController.abort();
  }, [user?.tariffId, user?.tariffAdjustmentId]);

  function getValue(
    tariffValue: string | number | undefined,
    adjustedValue: string | number | undefined,
    unit: string
  ) {
    if (tariffValue === undefined && adjustedValue === undefined) {
      return <p>Unlimited</p>;
    } else if (tariffValue !== undefined) {
      return (
        <p>
          {tariffValue} {unit}
        </p>
      );
    } else {
      return (
        <p>
          <span className="text-muted text-decoration-line-through me-2">
            {tariffValue}
          </span>
          <span className="text-success fw-bold">
            {adjustedValue} {unit}
          </span>
        </p>
      );
    }
  }

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <p>Something went wrong...</p>;
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
            <ListGroup.Item>Role: {user.role}</ListGroup.Item>
            <ListGroup.Item>Birh date: {user.birthDate}</ListGroup.Item>
            {user.tariffId && <p>You don't have any active tariffs.</p>}
            {user.tariffId && (
              <ListGroup.Item>
                <Nav.Link
                  className="text-primary fw-bold"
                  as={Link}
                  to={`/users/:id/my-tariff`}
                >
                  My tariff info
                </Nav.Link>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}
