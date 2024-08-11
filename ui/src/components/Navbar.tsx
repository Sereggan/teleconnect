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
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
