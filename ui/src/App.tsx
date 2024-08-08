import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement ";
import UserDetail from "./components/UserDetail";
import TariffManagement from "./components/TariffManagement";
import TariffDetail from "./components/TariffDetail";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/tariffs" element={<TariffManagement />} />
      <Route path="/tariffs/:id" element={<TariffDetail />} />
    </Routes>
  </Router>
);

export default App;
