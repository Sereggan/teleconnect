import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserClient";
import { User, UserRole } from "../../models/User";
import { Button, Form, Container, Spinner, Alert } from "react-bootstrap";

export default function NewUser() {
  const [user, setUser] = useState<User>({
    phoneNumber: "",
    password: "",
    email: "",
    name: "",
    surname: "",
    role: UserRole.ROLE_CUSTOMER,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createUser(user, controllerRef.current!);
      navigate("/users");
    } catch (error: any) {
      setError("Error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
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
          <Button type="submit" variant="success" className="mt-3">
            Create User
          </Button>
        </Form>
      )}
    </Container>
  );
}
