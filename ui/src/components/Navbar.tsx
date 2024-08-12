import { Link } from "react-router-dom";

function Header() {
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
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
