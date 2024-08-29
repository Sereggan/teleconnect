import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import UserManagement from "./components/user/UserManagement";
import UserDetails from "./components/user/UserDetails";
import EditUser from "./components/user/EditUser";
import NewUser from "./components/user/NewUser";
import TariffManagement from "./components/tariff/TariffManagement";
import EditTariff from "./components/tariff/EditTariff";
import NewTariff from "./components/tariff/NewTariff";
import TariffDetails from "./components/tariff/TariffDetails";
import Layout from "./components/Layout";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/edit/:id",
        element: (
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/add",
        element: (
          <ProtectedRoute>
            <NewUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs",
        element: (
          <ProtectedRoute>
            <TariffManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/:id",
        element: (
          <ProtectedRoute>
            <TariffDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/edit/:id",
        element: (
          <ProtectedRoute>
            <EditTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/add",
        element: (
          <ProtectedRoute>
            <NewTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <Main />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
