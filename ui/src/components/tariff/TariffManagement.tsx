import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import TariffCard from "./TariffCard";
import { UserRole } from "../../models/User";
import { getUserRoleFromToken } from "../auth/AuthUtils";
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
  const userRole = getUserRoleFromToken();

  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTariffs = async (page = 1, controller: AbortController) => {
    setIsLoading(true);

    try {
      let isActive: boolean | undefined;
      let isUsed: boolean | undefined;

      if (userRole === UserRole.ROLE_CUSTOMER) {
        isActive = true;
        isUsed = undefined;
      } else {
        isActive =
          filters.isActive !== "" ? filters.isActive === "true" : undefined;
        isUsed = filters.isUsed !== "" ? filters.isUsed === "true" : undefined;
      }
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
            isActive: isActive,
            isUsed: isUsed,
            limit: 25,
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
          <Button onClick={() => navigate("/tariffs/add")}>
            Add New Tariff
          </Button>
        </Col>
      </Row>

      <Form onSubmit={handleFilterSubmit} className="mb-4">
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

        {userRole === UserRole.ROLE_EMPLOYEE && (
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
        )}
        {userRole === UserRole.ROLE_EMPLOYEE && (
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
        )}

        <Button type="submit" variant="primary">
          Search Tariffs
        </Button>
      </Form>

      {error && <div>Something went wrong, please try again... {error}</div>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
        <Container>
          <Row>
            {tariffList.length === 0 ? (
              <Col>
                <p>No tariffs available.</p>
              </Col>
            ) : (
              tariffList.map((tariff) => (
                <Col key={tariff.id} md={4}>
                  <TariffCard tariff={tariff} />
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
                {pagination.currentPage}
              </Pagination.Item>
            ))}
          </Pagination>
        </Container>
      )}
    </Container>
  );
}
