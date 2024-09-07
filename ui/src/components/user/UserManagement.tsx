import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

  const [filters, setFilters] = useState({
    phoneNumber: "",
    email: "",
    name: "",
    surname: "",
    role: "",
    tariffId: "",
  });

  const isMountedRef = useRef(true);

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
          surname: filters.surname || undefined,
          role: filters.role || undefined,
          tariffId: filters.tariffId ? parseInt(filters.tariffId) : undefined,
          limit: pagination.itemsOnPage,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const controller = new AbortController();
    fetchUsers(1, controller);
    return () => {
      controller.abort();
    };
  };

  const handlePageChange = (page: number) => {
    const controller = new AbortController();
    fetchUsers(page, controller);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(pagination.currentPage, controller);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1>User Management</h1>
        </Col>
        <Col className="text-end">
          <Link to="/users/add">
            <Button variant="success">Add New User</Button>
          </Link>
        </Col>
      </Row>

      <Form onSubmit={handleFilterSubmit} className="mb-4">
        <Row>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={filters.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={filters.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={filters.surname}
                onChange={handleInputChange}
                placeholder="Surname"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={filters.role}
                onChange={handleSelectChange}
              >
                <option value="">Any</option>
                <option value="ROLE_EMPLOYEE">Employee</option>
                <option value="ROLE_CUSTOMER">Customer</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Tariff ID</Form.Label>
              <Form.Control
                type="number"
                name="tariffId"
                value={filters.tariffId}
                onChange={handleInputChange}
                placeholder="Tariff ID"
              />
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
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
}
