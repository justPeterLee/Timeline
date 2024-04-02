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
  redirect,
  RouterProvider,
} from "react-router-dom";
import RegistarPage from "./pages/user/Register.tsx";
import LoginPage from "./pages/user/LoginPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";

import {
  yearLoader,
  rescrictedURL,
  redirectURL,
  userLoader,
} from "./tools/loaders/loader.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TimelinePage />,
    loader: async ({ params }) => {
      await userLoader();
      await yearLoader(params.year);
      return null;
    },
    children: [
      {
        path: "/year/:year/:mode",
        element: <YearPage />,
        loader: async ({ params }) => {
          await yearLoader(params.year);
          return null;
        },
      },
      {
        path: "/month/:year/:month/:mode",
        element: <MonthPage />,
        loader: async ({ params }) => {
          await yearLoader(params.year);
          return null;
        },
      },
    ],
  },

  {
    path: "/user",
    element: <UserPage />,
    loader: async () => {
      await rescrictedURL("/login");
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
