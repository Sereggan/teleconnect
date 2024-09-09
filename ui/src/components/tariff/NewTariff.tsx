import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTariff } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";
import { Button, Form, Container, Spinner, Alert } from "react-bootstrap";

export default function NewTariff() {
  const [tariff, setTariff] = useState<Tariff>({
    name: "",
    price: 0,
    description: "",
    dataLimit: 0,
    callMinutes: 0,
    smsLimit: 0,
    isActive: true,
    isUsed: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setTariff((prevTariff) => ({
      ...prevTariff,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createTariff(tariff, controllerRef.current!);
      navigate("/tariffs");
    } catch (error: any) {
      setError("Error creating tariff");
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
              value={tariff.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="price" className="mt-3">
            <Form.Label>Price (Euro)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={tariff.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={tariff.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="dataLimit" className="mt-3">
            <Form.Label>Data Limit (MB)</Form.Label>
            <Form.Control
              type="number"
              name="dataLimit"
              value={tariff.dataLimit || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="callMinutes" className="mt-3">
            <Form.Label>Call Minutes</Form.Label>
            <Form.Control
              type="number"
              name="callMinutes"
              value={tariff.callMinutes || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="smsLimit" className="mt-3">
            <Form.Label>SMS Limit</Form.Label>
            <Form.Control
              type="number"
              name="smsLimit"
              value={tariff.smsLimit || ""}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="isActive" className="mt-3">
            <Form.Check
              type="checkbox"
              label="Active"
              name="isActive"
              checked={tariff.isActive}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" variant="success" className="mt-3">
            Create Tariff
          </Button>
        </Form>
      )}
    </Container>
  );
}
