import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTariff,
  getTariffById,
  updateTariff,
} from "../../clients/TariffClient";
import { Tariff } from "../../models/Tariff";
import {
  Button,
  Form,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  callMinutesValidation,
  dataLimitValidation,
  descriptionValidation,
  isActiveValidation,
  nameValidation,
  priceValidation,
  smsLimitValidation,
} from "../../validations/newTariffValidations";

export default function EditTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);
  const methods = useForm<Tariff>();

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
        } catch (error) {
          console.log(error);
          setError("Error fetching tariff");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTariff();

    return () => controller.abort();
  }, [id]);

  const onSubmit = methods.handleSubmit(async (tariff: Tariff) => {
    if (!tariff) return;
    setIsLoading(true);
    setTariff(tariff);
    try {
      await updateTariff(tariff, controllerRef.current!);
      navigate("/tariffs");
    } catch (error) {
      console.log(error);
      setError("Error updating tariff");
    } finally {
      setIsLoading(false);
    }
  });

  const handleDelete = async () => {
    if (!tariff || !tariff.id) return;
    setIsLoading(true);
    try {
      await deleteTariff(tariff.id, controllerRef.current!);
      navigate("/tariffs");
    } catch (error) {
      console.log(error);
      setError("Error deleting tariff");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
        <FormProvider {...methods}>
          <Form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            className="mb-4"
          >
            <Row>
              <Col md={12}>
                <FormInput {...nameValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...priceValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...descriptionValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...dataLimitValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...callMinutesValidation} />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput {...smsLimitValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...isActiveValidation} />
              </Col>
            </Row>

            <Button onClick={onSubmit} variant="primary" className="mt-3">
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
        </FormProvider>
      )}
    </Container>
  );
}
