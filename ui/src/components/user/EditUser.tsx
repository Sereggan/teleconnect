import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteUser, getUserById, updateUser } from "../../services/UserClient";
import { getTariffById } from "../../services/TariffClient";
import {
  getTariffAdjustment,
  updateTariffAdjustment,
} from "../../services/TariffAdjustmentClient";
import { User, UserRole } from "../../models/User";
import { Tariff } from "../../models/Tariff";
import { TariffAdjustment } from "../../models/TariffAdjustment";
import { Button, Container, Form, Nav } from "react-bootstrap";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTariff, setCurrentTariff] = useState<Tariff | undefined>(
    undefined
  );
  const [adjustment, setAdjustment] = useState<TariffAdjustment | undefined>(
    undefined
  );
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const userId = parseInt(id);
          const fetchedUser = await getUserById(userId, controller);
          if (fetchedUser) {
            setUser(fetchedUser);

            if (fetchedUser.tariffId) {
              const fetchedTariff = await getTariffById(
                fetchedUser.tariffId,
                controller
              );
              if (fetchedTariff) {
                setCurrentTariff(fetchedTariff);
              }
            }

            if (fetchedUser.tariffAdjustmentId) {
              const fetchedAdjustment = await getTariffAdjustment(
                fetchedUser.tariffAdjustmentId,
                controller
              );
              if (fetchedAdjustment) {
                setAdjustment(fetchedAdjustment);
              }
            }
          } else {
            setError("User not found");
          }
        }
      } catch (error: any) {
        if (!controller.signal.aborted) {
          setError("Error fetching data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const handleAdjustmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAdjustment((prevAdjustment) => ({
      ...prevAdjustment!,
      [name]: parseInt(value),
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.id) return;

    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      let updatedUser = { ...user };

      if (adjustment) {
        adjustment.userId = user.id;
        if (!user.tariffId) return;
        adjustment.tariffId = user.tariffId;
        adjustment.id = user.tariffAdjustmentId;
        const updatedAdjustment = await updateTariffAdjustment(
          adjustment,
          controllerRef.current
        );
        updatedUser = {
          ...updatedUser,
          tariffAdjustmentId: updatedAdjustment?.id,
        };
      }

      const fetchedUser = await updateUser(updatedUser, controllerRef.current);

      if (fetchedUser) {
        setUser(fetchedUser);
      }
    } catch (error: any) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error updating user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTariff = async () => {
    if (!user || !user.id) return;

    const updatedUser = { ...user, tariffId: undefined };
    setUser(updatedUser);

    controllerRef.current = new AbortController();
    setIsLoading(true);
    try {
      await updateUser(updatedUser, controllerRef.current);
      const fetchedUser = await getUserById(user.id, controllerRef.current);
      if (fetchedUser) {
        setUser(fetchedUser);
        setCurrentTariff(undefined);
      }
    } catch (error: any) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error disabling tariff");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !user.id) return;
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    try {
      await deleteUser(user.id, controller);
      navigate("/users");
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error deleting user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <div>{error}</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && user && (
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="surname" className="mt-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={user.surname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber" className="mt-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="role" className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={user.role}
                onChange={handleSelectChange}
                required
              >
                <option value={UserRole.ROLE_CUSTOMER}>Customer</option>
                <option value={UserRole.ROLE_EMPLOYEE}>Employee</option>
              </Form.Select>
            </Form.Group>

            {user.role === UserRole.ROLE_CUSTOMER && currentTariff && (
              <>
                <Container>
                  <Form.Group controlId="role" className="mt-3">
                    <Form.Label>
                      <Nav.Link as={Link} to={`/tariffs/${user.tariffId}`}>
                        Current tariff Info
                      </Nav.Link>
                    </Form.Label>
                  </Form.Group>

                  <Button onClick={() => handleDisableTariff}>
                    Disable Tariff
                  </Button>

                  <h3>Tariff Adjustments</h3>
                  <Form.Group controlId="adjustedDataLimit">
                    <Form.Label>Adjusted Data Limit</Form.Label>
                    <Form.Control
                      type="number"
                      name="adjustedDataLimit"
                      value={adjustment?.adjustedDataLimit || ""}
                      onChange={handleAdjustmentInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="adjustedCallMinutes">
                    <Form.Label>Adjusted Call Minutes</Form.Label>
                    <Form.Control
                      type="number"
                      name="adjustedCallMinutes"
                      value={adjustment?.adjustedCallMinutes || ""}
                      onChange={handleAdjustmentInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="adjustedCallMinutes">
                    <Form.Label>Adjusted SMS Limit</Form.Label>
                    <Form.Control
                      type="number"
                      name="adjustedSmsLimit"
                      value={adjustment?.adjustedSmsLimit || ""}
                      onChange={handleAdjustmentInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="discountPercentage">
                    <Form.Label>Discount Percentage</Form.Label>
                    <Form.Control
                      type="number"
                      name="discountPercentage"
                      value={adjustment?.discountPercentage || ""}
                      onChange={handleAdjustmentInputChange}
                    />
                  </Form.Group>
                </Container>
              </>
            )}
            <Button onClick={() => navigate(`/users/${user.id}/change-tariff`)}>
              Change Basic Tariff
            </Button>
            <Button type="submit">Update User</Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete User
            </Button>
          </Form>
        </Container>
      )}
    </>
  );
}
