import { FormInput } from "../common/FormInput";
import {
  idValidation,
  priceValidation,
  dataLimitValidation,
  callMinutesValidation,
  smsLimitValidation,
} from "../../validations/modification/tariffAdjustmentsValidations";
import { Tariff } from "../../models/Tariff";
import { useEffect, useRef, useState } from "react";
import { TariffAdjustment } from "../../models/TariffAdjustment";
import {
  deleteTariffAdjustment,
  getTariffAdjustmentByUserId,
  updateTariffAdjustment,
} from "../../clients/TariffAdjustmentClient";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getTariffByUserId } from "../../clients/TariffClient";

export default function EditUserTariffAdjustment() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tariffAdjustment, setTarifAdjustment] = useState<TariffAdjustment>();
  const [tariff, setTariff] = useState<Tariff>();

  const methods = useForm<TariffAdjustment>();
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController>();

  useEffect(() => {
    const controller = new AbortController();

    if (!id) {
      setError("Cannot fetch tariff without userId");
      return;
    }

    const loadTariff = async () => {
      try {
        setError("");
        const fetchedTariff = await getTariffByUserId(parseInt(id), controller);
        if (fetchedTariff) {
          setTariff(fetchedTariff);
        } else {
          setError("Cannot create adjustment without tariff");
          return;
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Could not fetch tariff");
        }
      }
    };

    setIsLoading(true);
    loadTariff();
    setIsLoading(false);

    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    if (!id) {
      setError("Cannot fetch tariff adjsutment without userId");
      return;
    }

    const loadTariffAdjustment = async () => {
      if (tariff) {
        try {
          setError("");
          const fetchedTariffAdjustment = await getTariffAdjustmentByUserId(
            parseInt(id),
            controller
          );

          if (fetchedTariffAdjustment) {
            setTarifAdjustment(fetchedTariffAdjustment);
          } else {
            setTarifAdjustment({
              userId: parseInt(id),
              tariffId: tariff!.id!,
            });
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            setError("Could not fetch tariff adjustment");
          }
        }
      } else {
        setError("Cannot create adjustment without tariff");
        return;
      }
    };

    if (tariff) {
      setIsLoading(true);
      loadTariffAdjustment();
      setIsLoading(false);
    }

    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, [tariff, id]);

  const onSubmit = methods.handleSubmit(
    async (filteredAdjustment: TariffAdjustment) => {
      setIsLoading(true);
      controllerRef.current = new AbortController();
      const updatedTariffAdjustment = {
        ...tariffAdjustment,
        ...filteredAdjustment,
      };
      try {
        const fetcheTariffAdjustment = await updateTariffAdjustment(
          updatedTariffAdjustment,
          controllerRef.current
        );
        setTarifAdjustment(fetcheTariffAdjustment);
      } catch (err) {
        if (!controllerRef.current.signal.aborted) {
          setError("Could not update tariff adjustment");
        }
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleDelete = async () => {
    controllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      if (tariffAdjustment?.id) {
        await deleteTariffAdjustment(
          tariffAdjustment.id,
          controllerRef.current
        );
      }
      navigate(`/users/${id}/edit`);
    } catch (error) {
      if (!controllerRef.current.signal.aborted) {
        setError("Error deleting tariff adjustment");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

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
        >
          <h3>Tariff Adjustments</h3>
          {tariffAdjustment?.id && (
            <Row>
              <Col md={6}>
                <FormInput
                  {...idValidation}
                  value={tariffAdjustment?.id ? tariffAdjustment.id : ""}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col md={6}>
              <Form.Text>Tariff default price: {tariff?.price}</Form.Text>
              <FormInput
                {...priceValidation}
                value={
                  tariffAdjustment?.price ? tariffAdjustment?.price : undefined
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Text>
                Tariff default data limit:
                {tariff?.dataLimit ? tariff.dataLimit : "Unlimited"}
              </Form.Text>
              <FormInput
                {...dataLimitValidation}
                value={
                  tariffAdjustment?.dataLimit
                    ? tariffAdjustment?.dataLimit
                    : undefined
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              Tariff default SMS limit:
              {tariff?.smsLimit ? tariff!.smsLimit : "Unlimited"}
              <FormInput
                {...smsLimitValidation}
                value={
                  tariffAdjustment?.smsLimit
                    ? tariffAdjustment?.smsLimit
                    : undefined
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              Tariff default call minutes limit:{" "}
              {tariff?.callMinutes ? tariff?.callMinutes : "Unlimited"}
              <FormInput
                {...callMinutesValidation}
                value={
                  tariffAdjustment?.callMinutes
                    ? tariffAdjustment?.callMinutes
                    : undefined
                }
              />
            </Col>
          </Row>
          <Button onClick={onSubmit} variant="primary" className="mt-3">
            Update Tariff Adjustment
          </Button>
          {tariffAdjustment?.id && (
            <Button
              variant="danger"
              type="button"
              onClick={handleDelete}
              className="mt-3 ms-2"
            >
              Delete Tariff Adjustment
            </Button>
          )}
        </Form>
      </FormProvider>
    </Container>
  );
}
