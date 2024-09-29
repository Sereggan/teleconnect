import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTariffs } from "../../services/TariffClient";
import { getUserById, updateUser } from "../../services/UserClient";
import { Tariff } from "../../models/Tariff";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Card,
  ListGroup,
} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  callMinutesMaxValidation,
  callMinutesMinValidation,
  dataLimitMaxValidation,
  dataLimitMinValidation,
  isActiveValidation,
  isUsedValidation,
  priceMaxValidation,
  priceMinValidation,
  smsLimitMaxValidation,
  smsLimitMinValidation,
} from "../../utils/tariffFilterValidations";

interface Filters {
  priceMin: string;
  priceMax: string;
  dataLimitMin: string;
  dataLimitMax: string;
  callMinutesMin: string;
  callMinutesMax: string;
  smsLimitMin: string;
  smsLimitMax: string;
}

export default function ChangeTariff() {
  const { id } = useParams<{ id: string }>();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    dataLimitMin: "",
    dataLimitMax: "",
    callMinutesMin: "",
    callMinutesMax: "",
    smsLimitMin: "",
    smsLimitMax: "",
  });
  const navigate = useNavigate();
  const controllerRef = useRef<AbortController | null>(null);
  const methods = useForm<Filters>();

  useEffect(() => {
    controllerRef.current = new AbortController();
    fetchTariffs(controllerRef.current);

    return () => {
      controllerRef.current?.abort();
    };
  }, [filters]);

  const fetchTariffs = async (controller: AbortController) => {
    setIsLoading(true);
    try {
      const fetchedTariffs = await getAllTariffs(
        {
          priceMin: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
          dataLimitMin: filters.dataLimitMin
            ? parseInt(filters.dataLimitMin)
            : undefined,
          dataLimitMax: filters.dataLimitMax
            ? parseInt(filters.dataLimitMax)
            : undefined,
          callMinutesMin: filters.callMinutesMin
            ? parseInt(filters.callMinutesMin)
            : undefined,
          callMinutesMax: filters.callMinutesMax
            ? parseInt(filters.callMinutesMax)
            : undefined,
          smsLimitMin: filters.smsLimitMin
            ? parseInt(filters.smsLimitMin)
            : undefined,
          smsLimitMax: filters.smsLimitMax
            ? parseInt(filters.smsLimitMax)
            : undefined,
          isActive: true,
          limit: 50,
        },
        controller
      );
      setTariffs(fetchedTariffs.tariffs ?? []);
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError("Error fetching tariffs");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectTariff = async (tariffId: number | undefined) => {
    if (!id || !tariffId) return;

    setIsLoading(true);
    try {
      const user = await getUserById(parseInt(id), controllerRef.current!);
      if (user) {
        await updateUser({ ...user, tariffId }, controllerRef.current!);
        navigate(`/users/edit/${id}`);
      }
    } catch (error: any) {
      setError("Error connecting tariff");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = methods.handleSubmit(() => {
    const controller = new AbortController();
    fetchTariffs(controller);
    return () => {
      controller.abort();
    };
  });

  return (
    <Container>
      <h2>Choose a Tariff</h2>
      {error && <div>{error}</div>}
      {isLoading && <Spinner animation="border" />}
      <FormProvider {...methods}>
        <Form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="mb-4"
        >
          <Row>
            <Col md={2}>
              <FormInput {...priceMinValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...priceMaxValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...dataLimitMinValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...dataLimitMaxValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...callMinutesMinValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...callMinutesMaxValidation} />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={2}>
              <FormInput {...smsLimitMinValidation} />
            </Col>
            <Col md={2}>
              <FormInput {...smsLimitMaxValidation} />
            </Col>
            <Col>
              <Button onClick={onSubmit} variant="primary" className="mt-3">
                Search Tariffs
              </Button>
            </Col>
          </Row>
        </Form>
      </FormProvider>
      {!isLoading && (
        <div>
          {tariffs &&
            tariffs.map((tariff) => (
              <Card
                key={tariff.id}
                className="mb-3"
                style={{
                  backgroundColor: tariff.isActive
                    ? "lightgreen"
                    : "lightcoral",
                }}
              >
                <Card.Title>{tariff.name}</Card.Title>
                <Card.Text>
                  <ListGroup>
                    <ListGroup.Item>{tariff.price} Euro</ListGroup.Item>
                    <ListGroup.Item>{tariff.description}</ListGroup.Item>
                    <ListGroup.Item>
                      Data Limit: {tariff.dataLimit ?? "Unlimited"} GB
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Minutes: {tariff.callMinutes ?? "Unlimited"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      SMS Limit: {tariff.smsLimit ?? "Unlimited"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Text>
                <Button onClick={() => handleConnectTariff(tariff.id)}>
                  Connect
                </Button>
              </Card>
            ))}
        </div>
      )}
    </Container>
  );
}
