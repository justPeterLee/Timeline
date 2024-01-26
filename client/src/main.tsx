import React from "react";
import ReactDOM from "react-dom/client";
import YearPage from "./pages/year/YearPage.tsx";
import MonthPage from "./pages/month/MonthPage.tsx";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
