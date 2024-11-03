import { useState, useEffect } from "react";
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
  idValidation,
  isActiveValidation,
  nameValidation,
  priceValidation,
  smsLimitValidation,
} from "../../validations/modification/tariffValidations";
import { FormSelect } from "../common/FormSelect";

export default function EditTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariff, setTariff] = useState<Tariff>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const methods = useForm<Tariff>();

  useEffect(() => {
    const controller = new AbortController();

    const fetchTariff = async () => {
      if (id) {
        setIsLoading(true);
        setError("");
        try {
          const tariffId = parseInt(id);
          const fetchedTariff = await getTariffById(tariffId, controller);
          if (fetchedTariff) {
            setTariff(fetchedTariff);
          } else {
            setError("Tariff not found");
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            setError("Error fetching tariff");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTariff();
    return () => controller.abort();
  }, [id]);

  const onSubmit = methods.handleSubmit(async (tariffFilter: Tariff) => {
    if (!tariff) return;
    setIsLoading(true);
    setTariff(tariffFilter);
    const controller = new AbortController();
    try {
      await updateTariff(tariffFilter, controller);
      navigate("/tariffs");
    } catch (error) {
      setError("Error updating tariff");
    } finally {
      setIsLoading(false);
      controller.abort();
    }
  });

  const handleDelete = async () => {
    if (!tariff || !tariff.id) return;
    setIsLoading(true);
    const controller = new AbortController();
    try {
      await deleteTariff(tariff.id, controller);
      navigate("/tariffs");
    } catch (error) {
      setError("Error deleting tariff");
    } finally {
      setIsLoading(false);
      controller.abort();
    }
  };

  if (error) {
    return <p>Something went wrong...</p>;
  }

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container>
      {!isLoading && !error && (
        <FormProvider {...methods}>
          <Form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            className="mb-4"
          >
            <Row>
              <Col md={6}>
                <FormInput
                  {...idValidation}
                  value={tariff?.id ? tariff?.id : 0}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...nameValidation}
                  value={tariff?.name ? tariff?.name : ""}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput
                  {...priceValidation}
                  value={tariff?.price ? tariff?.price : ""}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...descriptionValidation}
                  value={tariff?.description ? tariff?.description : ""}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput
                  {...dataLimitValidation}
                  value={tariff?.dataLimit ? tariff?.dataLimit : ""}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...callMinutesValidation}
                  value={tariff?.callMinutes ? tariff?.callMinutes : ""}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormInput
                  {...smsLimitValidation}
                  value={tariff?.smsLimit ? tariff?.smsLimit : ""}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormSelect
                  {...isActiveValidation}
                  value={
                    tariff?.isActive ? tariff?.isActive.toString() : "false"
                  }
                />
              </Col>
            </Row>
            {tariff && (
              <Row>
                <Col md={6}>
                  <p>Tariff is {!tariff.isUsed && "not"} used by users</p>
                </Col>
              </Row>
            )}
            <Button onClick={onSubmit} variant="primary" className="mt-3">
              Save Tariff
            </Button>
            <Button
              type="button"
              variant="danger"
              className="mt-3 ms-2"
              onClick={handleDelete}
              disabled={tariff?.isUsed}
            >
              Delete Tariff
            </Button>
          </Form>
        </FormProvider>
      )}
    </Container>
  );
}
