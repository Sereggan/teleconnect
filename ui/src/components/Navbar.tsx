import { useNavigate } from "react-router-dom";
import { getUserIdFromToken, getUserRoleFromToken } from "./auth/AuthUtils";
import { UserRole } from "../models/User";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const userRole: UserRole | null = getUserRoleFromToken();
  const userId: string | null = getUserIdFromToken();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>
          <h1>TeleConnect</h1>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Tariffs
          </Nav.Link>
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          )}
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Nav.Link as={Link} to="/users/my-tariff">
              My Tariff
            </Nav.Link>
          )}
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          )}
          {userRole && (
            <Nav.Link as={Link} to={`users/${userId}`}>
              My information
            </Nav.Link>
          )}
          {!userRole && (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
          {userRole && (
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
