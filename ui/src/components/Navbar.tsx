import { useNavigate } from "react-router-dom";
import { getUserIdFromToken, getUserRoleFromToken } from "./auth/AuthUtils";
import { UserRole } from "../models/User";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoutUser } from "../clients/AuthClient";

function Header() {
  const navigate = useNavigate();
  const userRole: UserRole | null = getUserRoleFromToken();
  const userId: string | null = getUserIdFromToken();

  const handleLogout = () => {
    const abortController = new AbortController();

    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token && refreshToken) {
      logoutUser({ token, refreshToken }, abortController);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    navigate("/login");

    return () => abortController.abort();
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>TeleConnect</Navbar.Brand>
        <Nav className="ms-auto w-100">
          <Nav.Link as={Link} to="/">
            Tariffs
          </Nav.Link>
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          )}
          {userRole === UserRole.ROLE_EMPLOYEE && (
            <Nav.Link as={Link} to="/statistics">
              Statistics
            </Nav.Link>
          )}
          {userRole && (
            <NavDropdown title="Me" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to={`users/${userId}`}>
                My profile
              </NavDropdown.Item>
              {userRole === UserRole.ROLE_CUSTOMER && (
                <>
                  <NavDropdown.Item as={Link} to={`/users/${userId}/my-tariff`}>
                    My Tariff
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to={`/users/${userId}/my-documents`}
                  >
                    My Documents
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          )}
          {!userRole && (
            <Nav.Link className="ms-auto" as={Link} to="/login">
              Login
            </Nav.Link>
          )}
          {userRole && (
            <Button className="ms-auto" variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
