import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import UserManagement from "./components/UserManagement ";
import UserDetails from "./components/UserDetails";
import UserForm from "./components/UserForm";
import TariffManagement from "./components/TariffManagement";
import TariffForm from "./components/TariffForm";
import NewTariff from "./components/NewTariff";
import Layout from "./components/Layout";
import TariffDetails from "./components/TariffDetails";

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
        element: <UserForm />,
      },
      {
        path: "users/add",
        element: <UserForm />,
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
        element: <TariffForm />,
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
