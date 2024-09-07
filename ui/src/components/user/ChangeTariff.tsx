import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTariffs } from "../../services/TariffClient";
import { getUserById, updateUser } from "../../services/UserClient";
import { Tariff } from "../../models/Tariff";
import { Button, Container, Row, Col, Spinner, Form } from "react-bootstrap";

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
    if (!id || tariffId) return;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <Container>
      <h2>Choose a Tariff</h2>
      {error && <div>{error}</div>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && (
        <>
          <Form className="mb-4">
            <Row>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Price Min</Form.Label>
                  <Form.Control
                    type="number"
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handleInputChange}
                    placeholder="Min Price"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Price Max</Form.Label>
                  <Form.Control
                    type="number"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handleInputChange}
                    placeholder="Max Price"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Data Limit Min</Form.Label>
                  <Form.Control
                    type="number"
                    name="dataLimitMin"
                    value={filters.dataLimitMin}
                    onChange={handleInputChange}
                    placeholder="Min Data"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Data Limit Max</Form.Label>
                  <Form.Control
                    type="number"
                    name="dataLimitMax"
                    value={filters.dataLimitMax}
                    onChange={handleInputChange}
                    placeholder="Max Data"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Call Minutes Min</Form.Label>
                  <Form.Control
                    type="number"
                    name="callMinutesMin"
                    value={filters.callMinutesMin}
                    onChange={handleInputChange}
                    placeholder="Min Minutes"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Call Minutes Max</Form.Label>
                  <Form.Control
                    type="number"
                    name="callMinutesMax"
                    value={filters.callMinutesMax}
                    onChange={handleInputChange}
                    placeholder="Max Minutes"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>SMS Limit Min</Form.Label>
                  <Form.Control
                    type="number"
                    name="smsLimitMin"
                    value={filters.smsLimitMin}
                    onChange={handleInputChange}
                    placeholder="Min SMS"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>SMS Limit Max</Form.Label>
                  <Form.Control
                    type="number"
                    name="smsLimitMax"
                    value={filters.smsLimitMax}
                    onChange={handleInputChange}
                    placeholder="Max SMS"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Button onClick={() => fetchTariffs(controllerRef.current!)}>
                  Apply Filters
                </Button>
              </Col>
            </Row>
          </Form>
          <div>
            {tariffs &&
              tariffs.map((tariff) => (
                <div
                  key={tariff.id}
                  style={{
                    backgroundColor: tariff.isActive
                      ? "lightgreen"
                      : "lightcoral",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>
                    {tariff.name} - {tariff.price} Euro
                  </p>
                  <p>{tariff.description}</p>
                  <p>
                    Data Limit: {tariff.dataLimit ?? "Unlimited"} GB, Call
                    Minutes: {tariff.callMinutes ?? "Unlimited"}, SMS Limit:
                    {tariff.smsLimit ?? "Unlimited"}
                  </p>
                  <Button onClick={() => handleConnectTariff(tariff.id)}>
                    Connect
                  </Button>
                </div>
              ))}
          </div>
        </>
      )}
    </Container>
  );
}
