import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/year/App.tsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/:year/:month/:mode",
        element: <App />,
      },
      // {
      //   path: "/:year/0/:moode",
      //   element: <App />,
      // },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
