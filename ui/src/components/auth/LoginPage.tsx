import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { signInUser } from "../../clients/AuthClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      const { token, refreshToken, userId } = await signInUser(
        { username, password },
        abortController
      );
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      navigate("/");
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }

    return () => abortController.abort();
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <h2>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email or phone number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Nav.Link as={Link} to="/resetPassword">
              Forgot password?
            </Nav.Link>
            <Button variant="primary" type="submit" className="mt-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
