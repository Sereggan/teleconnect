import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTariff } from "../../clients/TariffClient";
import { Tariff } from "../../models/Tariff";
import { FormInput } from "../common/FormInput";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Row, Col, Form, Alert } from "react-bootstrap";
import {
  callMinutesValidation,
  dataLimitValidation,
  descriptionValidation,
  isActiveValidation,
  nameValidation,
  priceValidation,
  smsLimitValidation,
} from "../../validations/modification/tariffValidations";

export default function NewTariff() {
  const methods = useForm<Tariff>();

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const onSubmit = methods.handleSubmit(async (tariff: Tariff) => {
    try {
      setError("");
      const controller = new AbortController();
      controllerRef.current = controller;
      await createTariff(tariff, controller);
      navigate("/tariffs");
    } catch (error) {
      setError("Error creating tariff");
    }
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
              <FormInput {...nameValidation} />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormInput {...priceValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...descriptionValidation} />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormInput {...dataLimitValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...callMinutesValidation} />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormInput {...smsLimitValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...isActiveValidation} />
            </Col>
          </Row>
          <Row>
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Create Tariff
            </Button>
          </Row>
        </Form>
      </FormProvider>
    </Container>
  );
}
