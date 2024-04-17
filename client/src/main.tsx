import React from "react";
import ReactDOM from "react-dom/client";

import YearPage from "./pages/year/YearPage.tsx";
import MonthPage from "./pages/month/MonthPage.tsx";

import "./index.css";

import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import RegistarPage from "./pages/user/Register.tsx";
import LoginPage from "./pages/user/LoginPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";

import {
  rescrictedURL,
  redirectURL,
  poleLoader,
} from "./tools/loaders/loader.ts";
import App from "./App.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      // await userLoader();
      const user = await redirectURL();
      return user;
    },
    children: [
      {
        path: "/year/:year/:mode",
        element: <YearPage />,
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
    loader: async () => {
      // await userLoader();
      await rescrictedURL("/login");
      await poleLoader();

      return null;
    },
  },
  {
    path: "/register",
    element: <RegistarPage />,
    loader: async () => {
      const user = await redirectURL();

      if (user) {
        throw redirect("/user");
      }
      return null;
    },
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: async () => {
      const user = await redirectURL();
      if (user) {
        throw redirect("/user");
      }
      return null;
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
