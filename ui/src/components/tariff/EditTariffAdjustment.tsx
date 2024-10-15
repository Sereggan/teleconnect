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
  getTariffAdjustment,
  updateTariffAdjustment,
} from "../../clients/TariffAdjustmentClient";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

interface TariffAdjustmentProps {
  userId?: number;
  tariff?: Tariff;
  tariffAdjustmentId?: number;
}

export default function EditTariffAdjustment() {
  const location = useLocation();
  const { userId, tariff, tariffAdjustmentId } =
    (location.state as TariffAdjustmentProps) || {};

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tariffAdjustment, setTarifAdjustment] = useState<TariffAdjustment>();

  const methods = useForm<TariffAdjustment>();
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController>();

  useEffect(() => {
    const controller = new AbortController();

    if (!userId || !tariff!.id) {
      setError("Cannot create adjustment without userId and tariffId");
      return;
    }

    const loadTariffAdjustment = async () => {
      if (tariffAdjustmentId) {
        try {
          const fetchedAdjastment = await getTariffAdjustment(
            tariffAdjustmentId,
            controller
          );

          setTarifAdjustment(fetchedAdjastment);
        } catch (err) {
          console.log(err);
          setError("Could not fetch tariff adjustment");
        }
      } else {
        setTarifAdjustment({
          userId,
          tariffId: tariff!.id!,
        });
      }
    };
    setIsLoading(true);
    loadTariffAdjustment();
    setIsLoading(false);

    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, []);

  const onSubmit = methods.handleSubmit(
    async (filteredAdjustment: TariffAdjustment) => {
      setIsLoading(true);
      controllerRef.current = new AbortController();
      const updatedTariffAdjustment = {
        ...tariffAdjustment,
        ...filteredAdjustment,
      };
      const fetcheTariffAdjustment = await updateTariffAdjustment(
        updatedTariffAdjustment,
        controllerRef.current
      );
      setTarifAdjustment(fetcheTariffAdjustment);
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
      navigate(`/users/edit/${userId}`);
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
    <FormProvider {...methods}>
      <Form onSubmit={(e) => e.preventDefault()} noValidate autoComplete="off">
        <h3>Tariff Adjustments</h3>
        <Row>
          <Col md={6}>
            <FormInput {...idValidation} value={tariff!.id!} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Text>Tariff default price: {tariff!.price}</Form.Text>
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
              Tariff default data limit:{" "}
              {tariff!.dataLimit ? tariff!.dataLimit : "Unlimited"}
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
            Tariff default SMS limit:{" "}
            {tariff!.smsLimit ? tariff!.smsLimit : "Unlimited"}
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
            {tariff!.callMinutes ? tariff!.callMinutes : "Unlimited"}
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
        <Button
          variant="danger"
          type="button"
          onClick={handleDelete}
          className="mt-3 ms-2"
        >
          Delete Tariff Adjustment
        </Button>
      </Form>
    </FormProvider>
  );
}
