import { useState, useEffect, useRef } from "react";
import { getTariffByUserId } from "../../clients/TariffClient";
import { getTariffAdjustmentByUserId } from "../../clients/TariffAdjustmentClient";
import { Tariff } from "../../models/Tariff";
import { Spinner, Container, Alert, Card, ListGroup } from "react-bootstrap";
import { TariffAdjustment } from "../../models/TariffAdjustment";
import { useParams } from "react-router-dom";

export default function UserTariff() {
  const { id } = useParams();
  const [tariff, setTariff] = useState<Tariff>();
  const [adjustment, setAdjustment] = useState<TariffAdjustment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchTariffAndAdjustment = async (
      userId: number,
      controller: AbortController
    ) => {
      setIsLoading(true);
      try {
        const tariff = await getTariffByUserId(userId, controller);
        setTariff(tariff);
        const adjustment = await getTariffAdjustmentByUserId(
          userId,
          controller
        );
        setAdjustment(adjustment);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.log(error);
          setError("Error fetching tariff or adjustment");
        }
      } finally {
        setIsLoading(false);
      }
    };

    controllerRef.current = new AbortController();
    if (id) {
      fetchTariffAndAdjustment(parseInt(id), controllerRef.current);
    } else {
      setError("Could not fetch user.");
    }

    return () => controllerRef.current?.abort();
  }, [id]);

  function getValue(
    tariffValue: string | number | undefined,
    adjustedValue: string | number | undefined,
    unit: string
  ) {
    if (tariffValue && !adjustedValue) {
      return (
        <p>
          {tariffValue} {unit}
        </p>
      );
    } else if (tariffValue && adjustedValue) {
      return (
        <p>
          <span className="text-muted text-decoration-line-through me-2">
            {tariffValue}
          </span>
          <span className="text-success fw-bold">
            {adjustedValue} {unit}
          </span>
        </p>
      );
    } else if (!adjustedValue) {
      return <p>Unlimited</p>;
    } else {
      return (
        <p>
          <span className="text-muted text-decoration-line-through me-2">
            "Unlimited"
          </span>
          <span className="text-success fw-bold">
            {adjustedValue} {unit}
          </span>
        </p>
      );
    }
  }

  if (!tariff) {
    return <Alert variant="info">You have no active tariffs.</Alert>;
  }

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
      {!isLoading && !error && tariff && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Current tariff plan: {tariff.name}</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                Price: {getValue(tariff?.price, adjustment?.price, "Euro")}
              </ListGroup.Item>
              <ListGroup.Item>
                Data: {getValue(tariff?.dataLimit, adjustment?.dataLimit, "GB")}
              </ListGroup.Item>
              <ListGroup.Item>
                SMS: {getValue(tariff?.smsLimit, adjustment?.smsLimit, "")}
              </ListGroup.Item>
              <ListGroup.Item>
                Calls:
                {getValue(
                  tariff?.callMinutes,
                  adjustment?.callMinutes,
                  "minutes"
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
