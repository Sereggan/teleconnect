import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

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
        <li>
          <Link to="/tariffs">Tariffs</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Header;
