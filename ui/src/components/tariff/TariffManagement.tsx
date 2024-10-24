import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTariffs } from "../../clients/TariffClient";
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
} from "../../validations/filtering/tariffValidations";
import { FormProvider, useForm } from "react-hook-form";
import { FormSelect } from "../common/FormSelect";

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
    currentPage: 0,
    totalPages: 0,
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

  const fetchTariffs = async (
    page = 0,
    controller: AbortController,
    filters: Filters
  ) => {
    setIsLoading(true);
    setError("");

    try {
      let isActiveFlag: boolean | undefined;
      if (userRole === UserRole.ROLE_CUSTOMER) {
        isActiveFlag = true;
      } else if (filters.isActive === "" || filters.isActive === undefined) {
        isActiveFlag = undefined;
      } else {
        isActiveFlag = filters.isActive === "true";
      }

      let isUsedFlag: boolean | undefined;
      if (userRole === UserRole.ROLE_CUSTOMER) {
        isUsedFlag = undefined;
      } else if (filters.isUsed === "" || filters.isUsed === undefined) {
        isUsedFlag = undefined;
      } else {
        isUsedFlag = filters.isUsed === "true";
      }

      const { tariffs, totalPages, currentPage } = await getAllTariffs(
        {
          priceMin: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
          priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
          dataLimitMin: filters.dataLimitMin
            ? parseInt(filters.dataLimitMin)
            : undefined,
          dataLimitMax: filters.dataLimitMax
            ? parseInt(filters.dataLimitMax)
            : undefined,
          isActive: isActiveFlag,
          isUsed: isUsedFlag,
          limit: 9,
          offset: page,
        },
        controller
      );

      setTariffList(tariffs ?? []);
      setPagination({
        currentPage,
        totalPages,
      });
    } catch (error) {
      if (!controller.signal.aborted) {
        console.log(error);
        setError("Could not load tariffs.");
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
    console.log(data);
    fetchTariffs(0, controller, data);
    return () => {
      controller.abort();
    };
  });

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchTariffs(page, controller, filters);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTariffs(pagination.currentPage, controller, filters);

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
            <Col md={3}>
              <FormInput {...priceMinValidation} />
            </Col>
            <Col md={3}>
              <FormInput {...priceMaxValidation} />
            </Col>
            <Col md={3}>
              <FormInput {...dataLimitMinValidation} />
            </Col>
            <Col md={3}>
              <FormInput {...dataLimitMaxValidation} />
            </Col>
          </Row>
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Row>
              <Col md={3}>
                <FormSelect {...isActiveValidation} />
              </Col>
              <Col md={3}>
                <FormSelect {...isUsedValidation} />
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
        <>
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

          {pagination.totalPages > 1 && (
            <Pagination>
              {[...Array(pagination.totalPages)].map(
                (_, i) =>
                  Math.abs(i - pagination.currentPage) <= 2 && (
                    <Pagination.Item
                      key={i}
                      active={i === pagination.currentPage}
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  )
              )}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}
