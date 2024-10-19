import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { signInUser } from "../../clients/AuthClient";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  passwordValidation,
  usernameValidation,
} from "../../validations/auth/authValidations";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<LoginForm>();

  const [error, setError] = useState<string | null>(null);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  const navigate = useNavigate();

  const handleLogin = methods.handleSubmit(async (loginDetails: LoginForm) => {
    setIsLoginDisabled(true);
    setTimeout(() => setIsLoginDisabled(false), 5_000);

    const abortController = new AbortController();
    try {
      setError("");
      const { token, refreshToken, userId } = await signInUser(
        { username: loginDetails.username, password: loginDetails.password },
        abortController
      );
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      navigate("/");
    } catch (error) {
      setError("Something went wrong during login, please try again later");
    }

    return () => abortController.abort();
  });

  if (error) {
    return <p>Something went wrong...</p>;
  }

  return (
    <Container>
      <FormProvider {...methods}>
        <Form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="mb-4"
        >
          <Row>
            <Col md={6}>
              <FormInput {...usernameValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...passwordValidation} />
            </Col>
          </Row>
          <Nav.Link as={Link} to="/resetPassword">
            Forgot password?
          </Nav.Link>
          <Button
            onClick={handleLogin}
            variant="primary"
            className="mt-3"
            disabled={isLoginDisabled}
          >
            Login
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
}
