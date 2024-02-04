import styles from "./User.module.css";
import { useState } from "react";
// import { current } from "../../tools/data";

import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Links";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
export default function LoginPage() {
  const dispatch = useDispatch();
  // console.log(current);
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<{ user: boolean; pass: boolean }>({
    user: false,
    pass: false,
  });

  const loginReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: "LOGIN",
      payload: user,
    });
  };

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);
  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginInputContainer}
        onSubmit={(e) => {
          loginReq(e);
        }}
      >
        <div className={styles.loginInput}>
          <ValidInput
            value={user.username}
            setValue={(par) => {
              setUser({ ...user, username: par });
            }}
            label="username / email"
            inputStyle={{ width: "250px" }}
            errorLabel="invalid user"
            error={{ custom: error.user }}
            // placeholder="email or"
          />

          <ValidInput
            value={user.password}
            setValue={(par) => {
              setUser({ ...user, password: par });
            }}
            label="password"
            inputStyle={{ width: "250px" }}
          />
        </div>
        <div className={styles.loginButton}>
          <button className={styles.actionButton} type="submit">
            login
          </button>

          <div className={styles.loginLink}>
            <Link to={"/register"} className="Link">
              create account
            </Link>
            <Link to={"/sign-up"} className="Link">
              forgot password
            </Link>
          </div>
        </div>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "LOGOUT" });
        }}
      >
        <button type="submit">logout</button>
      </form>
      <UserDateLine />
    </div>
  );
}

function UserDateLine() {
  return <div className={styles.userDateLine}></div>;
}
