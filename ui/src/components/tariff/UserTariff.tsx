import { useState, useEffect, useRef } from "react";
import { getTariffByUserId } from "../../services/TariffClient";
import { getTariffAdjustment } from "../../services/TariffAdjustmentClient";
import { Tariff } from "../../models/Tariff";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import { TariffAdjustment } from "../../models/TariffAdjustment";

export default function UserTariff() {
  const userId: string | null = localStorage.getItem("userId");
  const [userTariff, setUserTariff] = useState<Tariff | undefined>();
  const [adjustment, setAdjustment] = useState<TariffAdjustment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current = new AbortController();

    if (userId) {
      fetchTariffAndAdjustment(parseInt(userId), controllerRef.current);
    }

    return () => {
      controllerRef.current?.abort();
    };
  }, [userId]);

  const fetchTariffAndAdjustment = async (
    userId: number,
    controller: AbortController
  ) => {
    setIsLoading(true);
    try {
      const tariff = await getTariffByUserId(userId, controller);
      setUserTariff(tariff);

      const adjustment = await getTariffAdjustment(userId, controller);
      setAdjustment(adjustment);
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error fetching tariff or adjustment");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getAdjustedValue = (
    defaultValue: number | undefined,
    adjustedValue: number | undefined
  ) => {
    return adjustedValue !== undefined ? adjustedValue : defaultValue;
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (discount) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  return (
    <Container>
      {error && (
        <div>Something went wrong, please try again later: {error}</div>
      )}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && userTariff && (
        <Row>
          <Col>
            <h2>Your Tariff</h2>
            <p>
              <strong>Name: </strong> {userTariff.name}
            </p>
            <p>
              <strong>Price: </strong>{" "}
              {calculateDiscountedPrice(
                userTariff.price,
                adjustment?.discountPercentage
              )}
              Euro
            </p>
            <p>
              <strong>Data Limit: </strong>
              {getAdjustedValue(
                userTariff.dataLimit,
                adjustment?.adjustedDataLimit
              ) ?? "Unlimited"}
              GB
            </p>
            <p>
              <strong>Call Minutes: </strong>
              {getAdjustedValue(
                userTariff.callMinutes,
                adjustment?.adjustedCallMinutes
              ) ?? "Unlimited"}
            </p>
            <p>
              <strong>SMS Limit: </strong>
              {getAdjustedValue(
                userTariff.smsLimit,
                adjustment?.adjustedSmsLimit
              ) ?? "Unlimited"}
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
}
