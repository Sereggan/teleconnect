import { Link } from "react-router-dom";

function Main() {
  return (
    <div>
      <p>What do you want to do today?):</p>
      <ul>
        <li>
          <Link to="/users">User Management</Link>
        </li>
        <li>
          <Link to="/tariffs">Tariff Management</Link>
        </li>
      </ul>
    </div>
  );
}

export default Main;
