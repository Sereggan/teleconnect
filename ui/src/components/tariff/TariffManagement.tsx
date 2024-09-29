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
import { FormInput } from "../common/FormInput";
import {
  dataLimitMaxValidation,
  dataLimitMinValidation,
  isActiveValidation,
  isUsedValidation,
  priceMaxValidation,
  priceMinValidation,
} from "../../utils/tariffFilterValidations";
import { FormProvider, useForm } from "react-hook-form";

interface Filters {
  priceMin: string;
  priceMax: string;
  dataLimitMin: string;
  dataLimitMax: string;
  isActive: string;
  isUsed: string;
}

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

  const [filters, setFilters] = useState<Filters>({
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

  const methods = useForm<Filters>();

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

  const onSubmit = methods.handleSubmit((data: Filters) => {
    const controller = new AbortController();
    setFilters(data);
    fetchTariffs(1, controller);
    return () => {
      controller.abort();
    };
  });

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchTariffs(page, controller);
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
        {userRole === UserRole.ROLE_EMPLOYEE && (
          <Col className="text-end mt-5">
            <Button onClick={() => navigate("/tariffs/add")}>
              Add New Tariff
            </Button>
          </Col>
        )}
      </Row>
      <FormProvider {...methods}>
        <Form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="mb-4"
        >
          <Row>
            <Col md={6}>
              <FormInput {...priceMinValidation} />
            </Col>
            <Col md={6}>
              <FormInput {...priceMaxValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...dataLimitMinValidation} />
            </Col>
            <Col>
              <FormInput {...dataLimitMaxValidation} />
            </Col>
          </Row>
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Row>
              <Col md={6}>
                <FormInput {...isActiveValidation} />
              </Col>
              <Col md={6}>
                <FormInput {...isUsedValidation} />
              </Col>
            </Row>
          )}

          <Button onClick={onSubmit} variant="primary" className="mt-3">
            Search Tariffs
          </Button>
        </Form>
      </FormProvider>
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
