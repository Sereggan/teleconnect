import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import UserManagement from "./components/UserManagement ";
import UserDetail from "./components/UserDetail";
import TariffManagement from "./components/TariffManagement";
import TariffDetail from "./components/TariffDetail";

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/tariffs" element={<TariffManagement />} />
      <Route path="/tariffs/:id" element={<TariffDetail />} />
      <Route path="*" element={<Main />} />
    </Routes>
  </Router>
);

export default App;
