import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import EditUserTariffAdjustment from "./components/user/EditUserTariffAdjustment";
import UserDocument from "./components/documents/UserDocuments";
import EditUserDocuments from "./components/documents/EditUserDocuments";
import TicketManagment from "./components/ticket/TicketManagement";
import NewTicket from "./components/ticket/NewTicket";
import UserTickets from "./components/user/UserTickets";
import EditTicket from "./components/ticket/EditTicket";
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <TariffManagement />,
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
        path: "users/add",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <NewUser />
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
        path: "users/:id/edit",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/tariff",
        element: (
          <ProtectedRoute
            requiredRoles={[UserRole.ROLE_CUSTOMER, UserRole.ROLE_EMPLOYEE]}
          >
            <UserTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit/tariff-adjustment",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditUserTariffAdjustment />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/documents",
        element: (
          <ProtectedRoute
            requiredRoles={[UserRole.ROLE_CUSTOMER, UserRole.ROLE_EMPLOYEE]}
          >
            <UserDocument />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit/documents",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditUserDocuments />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/tickets",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_CUSTOMER]}>
            <UserTickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "tariffs/:id",
        element: <TariffDetails />,
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
        path: "tariffs/:id/edit",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditTariff />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <TicketManagment />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets/add",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_CUSTOMER]}>
            <NewTicket />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets/:id/edit",
        element: (
          <ProtectedRoute requiredRoles={[UserRole.ROLE_EMPLOYEE]}>
            <EditTicket />
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
        element: <TariffManagement />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
