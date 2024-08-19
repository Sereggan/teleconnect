import { useState, useEffect } from "react";
import TariffCard from "./TariffCard";
import { Link } from "react-router-dom";
import { getAllTariffs } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";
import { Button, Container, Row, Col } from "react-bootstrap";

export default function TariffManagement() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tariffList, setTariffList] = useState<Tariff[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchTariffs = async () => {
      try {
        const tariffs = await getAllTariffs();
        setTariffList(tariffs ?? []);
      } catch (error: any) {
        console.error("Failed to fetch tariffs: ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1>Tariff Management</h1>
        </Col>
        <Col className="text-end">
          <Link to="/tariffs/add">
            <Button variant="success">Add New Tariff</Button>
          </Link>
        </Col>
      </Row>
      {error && <div>Something went wrong, please try again...</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <Row>
          {tariffList.length === 0 ? (
            <Col>
              <p>No tariffs available.</p>
            </Col>
          ) : (
            tariffList
              .sort((a, b) => a.id - b.id)
              .map((t) => (
                <Col key={t.id} md={4} className="d-flex align-items-stretch">
                  <TariffCard tariff={t} />
                </Col>
              ))
          )}
        </Row>
      )}
    </Container>
  );
}
