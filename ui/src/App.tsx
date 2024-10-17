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
import { UserRole } from "./models/User";
import UserTariff from "./components/user/UserTariff";
import StatisticsDashboard from "./components/statistics/StatisticsDashboard";
import ResetPassword from "./components/auth/ResetPassword";
import EditTariffAdjustment from "./components/tariff/EditTariffAdjustment";
import UserDocument from "./components/documents/UserDocuments";
import EditUserDocuments from "./components/documents/EditUserDocuments";

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
        element: <TariffManagement />,
      },
      {
        path: "tariffs/:id",
        element: <TariffDetails />,
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute
            requiredRoles={[UserRole.ROLE_EMPLOYEE, UserRole.ROLE_CUSTOMER]}
          >
            <UserDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/my-tariff",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_CUSTOMER]}>
            <UserTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/my-documents",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_CUSTOMER]}>
            <UserDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit-documents",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditUserDocuments />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/edit/:id",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/tariff-adjustment",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditTariffAdjustment />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/add",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <NewUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/edit/:id",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/add",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <NewTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "statistics",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <StatisticsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "resetPassword",
        element: <ResetPassword />,
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
