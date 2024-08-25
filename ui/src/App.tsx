import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import UserManagement from "./components/user/UserManagement ";
import UserDetails from "./components/user/UserDetails";
import UserForm from "./components/user/EditUser";
import TariffManagement from "./components/tariff/TariffManagement";
import EditTariff from "./components/tariff/EditTariff";
import NewTariff from "./components/tariff/NewTariff";
import Layout from "./components/Layout";
import TariffDetails from "./components/tariff/TariffDetails";
import NewUser from "./components/user/NewUser";
import EditUser from "./components/user/EditUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "users/:id",
        element: <UserDetails />,
      },
      {
        path: "users/edit/:id",
        element: <EditUser />,
      },
      {
        path: "users/add",
        element: <NewUser />,
      },
      {
        path: "tariffs",
        element: <TariffManagement />,
      },
      {
        path: "tariffs/:id",
        element: <TariffDetails />,
      },
      {
        path: "tariffs/edit/:id",
        element: <EditTariff />,
      },
      {
        path: "tariffs/add",
        element: <NewTariff />,
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
