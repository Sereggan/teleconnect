import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../services/UserClient";
import { User } from "../../models/User";
import { Button, Container, Row, Col } from "react-bootstrap";
import UserCard from "./UserCard";

export default function UserManagement() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserList(users ?? []);
      } catch (error: any) {
        console.error("Failed to fetch users: ", error);
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
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
      {error && <div>Something went wrong, please try again...</div>}
      {isLoading && <div>Loading...</div>}
      {!isLoading && !error && (
        <Row>
          {userList.length === 0 ? (
            <Col>
              <p>No users available.</p>
            </Col>
          ) : (
            userList
              .sort((a, b) => a.id - b.id)
              .map((user) => (
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
      )}
    </Container>
  );
}
