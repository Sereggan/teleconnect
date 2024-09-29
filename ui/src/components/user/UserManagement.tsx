import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/UserClient";
import { User } from "../../models/User";
import {
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Pagination,
} from "react-bootstrap";
import UserCard from "./UserCard";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  phoneNumberValidation,
  emailValidation,
  nameValidation,
  familyNameValidation,
  roleValidation,
  tariffIdValidation,
} from "../../utils/userFilterValidations";

interface Filters {
  phoneNumber: string;
  email: string;
  name: string;
  familyName: string;
  role: string;
  tariffId: string;
}

export default function UserManagement() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsOnPage: 25,
  });
  const [filters, setFilters] = useState<Filters>({
    phoneNumber: "",
    email: "",
    name: "",
    familyName: "",
    role: "",
    tariffId: "",
  });
  const nagivate = useNavigate();
  const isMountedRef = useRef(true);
  const methods = useForm<Filters>();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUsers = async (page = 1, controller: AbortController) => {
    setIsLoading(true);

    try {
      const { users: users, pagination: paginationData } = await getAllUsers(
        {
          phoneNumber: filters.phoneNumber || undefined,
          email: filters.email || undefined,
          name: filters.name || undefined,
          familyName: filters.familyName || undefined,
          role: filters.role || undefined,
          tariffId: filters.tariffId ? parseInt(filters.tariffId) : undefined,
          limit: 25,
          offset: page - 1,
        },
        controller
      );
      if (isMountedRef.current) {
        setUserList(users ?? []);
        setPagination({
          currentPage: page,
          totalPages: paginationData.totalPages,
          totalItems: paginationData.totalItems,
          itemsOnPage: paginationData.itemsOnPage,
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
    fetchUsers(1, controller);
    return () => controller.abort();
  });

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchUsers(page, controller);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(pagination.currentPage, controller);
    return () => controller.abort();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Management</h1>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => nagivate("/users/add")}>
            Add New User
          </Button>
        </Col>
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
              <FormInput {...phoneNumberValidation} />
            </Col>
            <Col md={6}>
              <FormInput {...emailValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...nameValidation} />
            </Col>
            <Col md={6}>
              <FormInput {...familyNameValidation} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormInput {...roleValidation} />
            </Col>
            <Col md={6}>
              <FormInput {...tariffIdValidation} />
            </Col>
          </Row>

          <Button onClick={onSubmit} variant="primary" className="mt-3">
            Search
          </Button>
        </Form>
      </FormProvider>

      {error && <p>Something went wrong, please try again... {error}</p>}
      {isLoading && <Spinner animation="border" />}
      {!isLoading && !error && (
        <Container>
          <Row>
            {userList.length === 0 ? (
              <Col>
                <p>No users available.</p>
              </Col>
            ) : (
              userList.map((user) => (
                <Col
                  key={user.id}
                  md={4}
                  className="d-flex align-items-stretch"
                >
                  <UserCard user={user} />
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
