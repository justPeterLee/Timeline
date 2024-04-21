import React from "react";
import ReactDOM from "react-dom/client";

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
import NotFoundPage from "./pages/404.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    loader: async () => {
      // await userLoader();
      const user: any = await redirectURL();
      return user;
    },
    children: [
      {
        path: "/year/:year/:mode",
        element: <></>,
      },
      {
        path: "/month/:year/:month/:mode",
        element: <></>,
      },
    ],
  },

  {
    path: "/user",
    element: <UserPage />,
    loader: async () => {
      await rescrictedURL("/login");
      await poleLoader();

      return null;
    },
  },

  {
    path: "/register",
    element: <RegistarPage />,
    loader: async () => {
      store.dispatch({ type: "CLEAR_ERROR" });
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
      store.dispatch({ type: "CLEAR_ERROR" });
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
