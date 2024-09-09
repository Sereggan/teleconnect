import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTariff,
  getTariffById,
  updateTariff,
} from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";
import { Button, Form, Spinner, Alert, Container } from "react-bootstrap";

export default function EditTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTariff = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const tariffId = parseInt(id);
          const fetchedTariff = await getTariffById(tariffId, controller);
          if (fetchedTariff) {
            setTariff(fetchedTariff);
          } else {
            setError("Tariff not found");
          }
        } catch (error: any) {
          if (!controller.signal.aborted) {
            setError(error.message || "Error fetching tariff");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTariff();

    return () => controller.abort();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!tariff) return;
    const { name, value, type, checked } = event.target;
    setTariff((prevTariff) => ({
      ...prevTariff!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tariff) return;
    setIsLoading(true);
    try {
      await updateTariff(tariff, controllerRef.current!);
      navigate("/tariffs");
    } catch (error: any) {
      setError("Error updating tariff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tariff || !tariff.id) return;
    setIsLoading(true);
    try {
      await deleteTariff(tariff.id, controllerRef.current!);
      navigate("/tariffs");
    } catch (error: any) {
      setError("Error deleting tariff");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && tariff && (
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
          <Button type="submit" variant="primary" className="mt-3">
            Save Tariff
          </Button>
          <Button
            type="button"
            variant="danger"
            className="mt-3 ms-2"
            onClick={handleDelete}
          >
            Delete Tariff
          </Button>
        </Form>
      )}
    </Container>
  );
}
