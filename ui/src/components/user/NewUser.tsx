import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserClient";
import { User, UserRole } from "../../models/User";
import { Button, Form, Container, Alert, Row, Col } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  phoneNumberValidation,
  passwordValidation,
  emailValidation,
  nameValidation,
  familyNameValidation,
  roleValidation,
  birthDateValidation,
} from "../../utils/newUserValidations";
import { FormSelect } from "../common/FormSelect";

export default function NewUser() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);
  const methods = useForm<User>();

  const onSubmit = methods.handleSubmit(async (user: User) => {
    try {
      const controller = new AbortController();
      controllerRef.current = controller;
      await createUser(user, controller);
      navigate("/users");
    } catch (error: any) {
      setError("Error creating user");
    }
  });

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && (
        <FormProvider {...methods}>
          <Form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
            className="mb-4"
          >
            <Row>
              <Col md={6}>
                <FormInput {...nameValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...familyNameValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...phoneNumberValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...emailValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...passwordValidation} />
              </Col>
              <Col md={6}>
                <FormSelect
                  {...roleValidation}
                  options={[
                    { value: UserRole.ROLE_CUSTOMER, label: "Customer" },
                    { value: UserRole.ROLE_EMPLOYEE, label: "Employee" },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...birthDateValidation} />
              </Col>
            </Row>

            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Create User
            </Button>
          </Form>
        </FormProvider>
      )}
    </Container>
  );
}
