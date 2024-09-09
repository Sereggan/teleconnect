import { Link, useNavigate } from "react-router-dom";
import {
  getUserIdFromToken,
  getUserRoleFromToken,
  isLoggedIn,
} from "./auth/AuthUtils";
import { UserRole } from "../models/User";

function Header() {
  const navigate = useNavigate();
  const userRole = getUserRoleFromToken();
  const userId = getUserIdFromToken();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <h1>Teleconnect</h1>
        <li>
          <Link to="/">Main Page</Link>
        </li>
        {userRole === UserRole.ROLE_EMPLOYEE && (
          <li>
            <Link to="/users">Users</Link>
          </li>
        )}
        {userRole === UserRole.ROLE_CUSTOMER && (
          <li>
            <Link to="/users/my-tariff">My Tariff</Link>
          </li>
        )}
        {isLoggedIn() && (
          <li>
            <Link to={`users/${userId}`}>My info</Link>
          </li>
        )}
        {!isLoggedIn() && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
      {isLoggedIn() && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Header;
