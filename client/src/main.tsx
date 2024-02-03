import React from "react";
import ReactDOM from "react-dom/client";
import YearPage from "./pages/year/YearPage.tsx";
import MonthPage from "./pages/month/MonthPage.tsx";
// import
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegistarPage from "./pages/user/Register.tsx";
import LoginPage from "./pages/user/LoginPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <YearPage />,
  },
  {
    path: "/year/:year/:mode",
    element: <YearPage />,
  },
  {
    path: "/month/:year/:month/:mode",
    element: <MonthPage />,
  },
  {
    path: "/user",
    element: <UserPage />,
  },
  {
    path: "/register",
    element: <RegistarPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
