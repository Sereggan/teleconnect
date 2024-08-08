import { Link } from "react-router-dom";

const Dashboard = () => (
  <div>
    <h1>Telecom Management System</h1>
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

export default Dashboard;
