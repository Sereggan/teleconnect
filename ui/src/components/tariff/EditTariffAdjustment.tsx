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
  getTariffAdjustmentByUserId,
  updateTariffAdjustment,
} from "../../clients/TariffAdjustmentClient";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getTariffByUserId } from "../../clients/TariffClient";

export default function EditTariffAdjustment() {
  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tariffAdjustment, setTarifAdjustment] = useState<TariffAdjustment>();
  const [tariff, setTariff] = useState<Tariff>();

  const methods = useForm<TariffAdjustment>();
  const navigate = useNavigate();

  const controllerRef = useRef<AbortController>();

  useEffect(() => {
    const controller = new AbortController();

    if (!userId) {
      setError("Cannot fetch tariff without userId");
      return;
    }

    const loadTariff = async () => {
      try {
        const fetchedTariff = await getTariffByUserId(
          Number(userId),
          controller
        );
        if (fetchedTariff) {
          setTariff(fetchedTariff);
        } else {
          setError("Cannot create adjustment without tariff");
          return;
        }
      } catch (err) {
        setError("Could not fetch tariff");
        console.log(err);
      }
    };

    setIsLoading(true);
    loadTariff();
    setIsLoading(false);

    return () => {
      controller.abort();
      controllerRef.current?.abort();
    };
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();
    if (!userId) {
      setError("Cannot fetch tariff adjsutment without userId");
      return;
    }

    const loadTariffAdjustment = async () => {
      if (tariff) {
        try {
          const fetchedTariffAdjustment = await getTariffAdjustmentByUserId(
            Number(userId),
            controller
          );

          if (tariffAdjustment) {
            setTarifAdjustment(fetchedTariffAdjustment);
          } else {
            setTarifAdjustment({
              userId: Number(userId),
              tariffId: tariff!.id!,
            });
          }
        } catch (err) {
          console.log(err);
          setError("Could not fetch tariff adjustment");
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
  }, [tariff, userId]);

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
            <FormInput {...idValidation} value={tariffAdjustment!.id!} />
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
