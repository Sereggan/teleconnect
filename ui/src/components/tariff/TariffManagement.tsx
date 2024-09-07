import { useState, useEffect, useRef } from "react";
import TariffCard from "./TariffCard";
import { Link } from "react-router-dom";
import { getAllTariffs } from "../../services/TariffClient";
import { Tariff } from "../../models/Tariff";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";

export default function TariffManagement() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tariffList, setTariffList] = useState<Tariff[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsOnPage: 25,
  });

  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    dataLimitMin: "",
    dataLimitMax: "",
    isActive: "",
    isUsed: "",
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTariffs = async (page = 1, controller: AbortController) => {
    setIsLoading(true);

    try {
      const { tariffs, totalItems, totalPages, itemsOnPage } =
        await getAllTariffs(
          {
            priceMin: filters.priceMin
              ? parseFloat(filters.priceMin)
              : undefined,
            priceMax: filters.priceMax
              ? parseFloat(filters.priceMax)
              : undefined,
            dataLimitMin: filters.dataLimitMin
              ? parseInt(filters.dataLimitMin)
              : undefined,
            dataLimitMax: filters.dataLimitMax
              ? parseInt(filters.dataLimitMax)
              : undefined,
            isActive:
              filters.isActive !== "" ? filters.isActive === "true" : undefined,
            isUsed:
              filters.isUsed !== "" ? filters.isUsed === "true" : undefined,
            limit: pagination.itemsOnPage,
            offset: page - 1,
          },
          controller
        );
      if (isMountedRef.current) {
        setTariffList(tariffs ?? []);
        setPagination({
          currentPage: page,
          totalItems,
          totalPages,
          itemsOnPage,
        });
      }
    } catch (error: any) {
      if (!controller.signal.aborted) {
        setError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const controller = new AbortController();
    fetchTariffs(1, controller);
    return () => {
      controller.abort();
    };
  };

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchTariffs(page, controller);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTariffs(pagination.currentPage, controller);
    return () => {
      controller.abort();
    };
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

      <Form onSubmit={handleFilterSubmit} className="mb-4">
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
              <Form.Label>Is Active</Form.Label>
              <Form.Select
                name="isActive"
                value={filters.isActive}
                onChange={handleSelectChange}
              >
                <option value="">Any</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Is Used</Form.Label>
              <Form.Select
                name="isUsed"
                value={filters.isUsed}
                onChange={handleSelectChange}
              >
                <option value="">Any</option>
                <option value="true">Used</option>
                <option value="false">Unused</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button type="submit" variant="primary">
              Apply Filters
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <div>Something went wrong, please try again... {error}</div>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
        <>
          <Row>
            {tariffList.length === 0 ? (
              <Col>
                <p>No tariffs available.</p>
              </Col>
            ) : (
              tariffList.map((t) => (
                <Col key={t.id} md={4} className="d-flex align-items-stretch">
                  <TariffCard tariff={t} />
                </Col>
              ))
            )}
          </Row>

          <Pagination>
            {Array.from({ length: pagination.totalPages }, (_, idx) => (
              <Pagination.Item
                key={idx}
                active={idx + 1 === pagination.currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
}
