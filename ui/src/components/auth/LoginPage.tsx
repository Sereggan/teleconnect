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
import axios from "axios";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<LoginForm>();

  const [error, setError] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  const navigate = useNavigate();

  const handleLogin = methods.handleSubmit(async (loginDetails: LoginForm) => {
    setIsLoginDisabled(true);
    setTimeout(() => setIsLoginDisabled(false), 5_000);

    const abortController = new AbortController();
    try {
      setError("");
      setAuthError("");
      const { token, refreshToken } = await signInUser(
        { username: loginDetails.username, password: loginDetails.password },
        abortController
      );
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setAuthError("Provided credentials are wrong.");
        }
      } else {
        setError("Something went wrong during login, please try again later");
      }
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
          {authError && (
            <p className="text-danger">Provided credentials are wrong.</p>
          )}
          <Button
            onClick={handleLogin}
            variant="primary"
            disabled={isLoginDisabled}
          >
            Login
          </Button>
        </Form>
      </FormProvider>
    </Container>
  );
}
