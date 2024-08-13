import { useState, useEffect } from "react";
import TariffCard from "./TariffCard";
import { Link } from "react-router-dom";
import { getAllTariffs } from "../services/TariffClient";
import { Tariff } from "../model/Tariff";
import axios, { AxiosResponse } from "axios";
import { Button, Container, Row, Col } from "react-bootstrap";

export default function TariffManagement() {
  const [tariffList, setTariffList] = useState<Tariff[]>([]);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const tariffs = await getAllTariffs();
        setTariffList(tariffs ?? []);
      } catch (error) {
        console.error("Failed to fetch tariffs:", error);
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
      <Row>
        {tariffList.length === 0 ? (
          <Col>
            <p>No tariffs available.</p>
          </Col>
        ) : (
          tariffList.map((t) =>
            t.isActive ? (
              <Col key={t.id} md={4} className="d-flex align-items-stretch">
                <TariffCard tariff={t} />
              </Col>
            ) : null
          )
        )}
      </Row>
    </Container>
  );
}
