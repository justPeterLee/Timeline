import React from "react";
import ReactDOM from "react-dom/client";

import TimelinePage from "./pages/TimelinePage/TimelinePage.tsx";
import YearPage from "./pages/year/YearPage.tsx";
import MonthPage from "./pages/month/MonthPage.tsx";

import "./index.css";

import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

import {
  createBrowserRouter,
  json,
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

async function userLoader() {
  try {
    store.dispatch({ type: "FETCH_USER" });
    return null;
  } catch (e: any) {
    throw json(
      { message: "Error occured while fetching user" },
      { status: e.status }
    );
  }
}
async function yearLoad() {
  try {
    store.dispatch({ type: "GET_TIMEPOLE_SERVER" });
    return null;
  } catch (e: any) {
    throw json(
      { message: "Error occured while fetching year data" },
      { status: e.status }
    );
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <TimelinePage />,
    loader: async () => {
      try {
        await userLoader();
        await yearLoad();
        return null;
      } catch (e: any) {
        throw json(
          { message: "Error occured while fetching data" },
          { status: e.status }
        );
      }
    },
    children: [
      {
        path: "/year/:year/:mode",
        element: <YearPage />,
        loader: yearLoad,
      },
      {
        path: "/month/:year/:month/:mode",
        element: <MonthPage />,
      },
    ],
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
