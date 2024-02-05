import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import YearPage from "./pages/year/YearPage.tsx";
import MonthPage from "./pages/month/MonthPage.tsx";
import "./index.css";

import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store.ts";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import RegistarPage from "./pages/user/Register.tsx";
import LoginPage from "./pages/user/LoginPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";

import axios from "axios";

async function rescricted(url: string) {
  try {
    await axios.get("/api/v1/userAction");
    return null;
  } catch (err) {
    return redirect(url);
  }
}

async function redirectURL(url: string) {
  try {
    await axios.get("/api/v1/userAction");
    return redirect(url);
  } catch (err) {
    return null;
  }
}
// user();
// getUser();

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
    loader: () => {
      return rescricted("/login");
    },
  },
  {
    path: "/register",
    element: <RegistarPage />,
    loader: () => {
      return redirectURL("/user");
    },
    // loader:
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      return redirectURL("/user");
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
