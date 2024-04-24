import styles from "./User.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Elements";
import { useDispatch } from "react-redux";

import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
export default function LoginPage() {
  const dispatch = useDispatch();
  const loginError = useAppSelector((store) => store.userAccount.userError);

  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [isError, setIsError] = useState({ user: false, pass: false });

  const validateInput = () => {
    let state = false;
    const proxyError = { ...isError };

    if (!user.username.replace(/\s/g, "")) {
      proxyError.user = true;
      state = true;
    } else {
      proxyError.user = false;
      state = false;
    }

    if (!user.password.replace(/\s/g, "")) {
      proxyError.pass = true;
      state = true;
    } else {
      proxyError.pass = false;
      state = false;
    }

    setIsError({ ...proxyError });
    return state;
  };

  const loginReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInput()) {
      throw "invalid user";
    }

    dispatch({
      type: "LOGIN",
      payload: user,
    });
  };

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
            label="username / email"
            value={user.username}
            setValue={(par) => {
              setUser({ ...user, username: par });
            }}
            inputStyle={{ width: "250px" }}
            error={{
              label: loginError.isError ? loginError.lable : "invalid username",
              state: loginError.isError ? loginError.isError : isError.user,
            }}
          />

          <ValidInput
            value={user.password}
            setValue={(par) => {
              setUser({ ...user, password: par });
            }}
            label="password"
            inputStyle={{ width: "250px" }}
            error={{ label: "invalid password", state: isError.pass }}
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
            <Link to={"/"} className="Link">
              continue without account
            </Link>
          </div>
        </div>
      </form>
      <UserDateLine />
    </div>
  );
}

function UserDateLine() {
  return <div className={styles.userDateLine}></div>;
}
