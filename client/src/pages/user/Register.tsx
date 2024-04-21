import styles from "./User.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Elements";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";

export default function Registar() {
  const dispatch = useDispatch();
  const registerError = useAppSelector((store) => store.userAccount.userError);

  const [user, setUser] = useState<{
    user: string;
    pass: string;
    email: string;
  }>({
    user: "",
    pass: "",
    email: "",
  });

  const [error, setError] = useState<{
    user: boolean;
    pass: boolean;
    email: boolean;
  }>({
    user: false,
    pass: false,
    email: false,
  });

  const validateInput = () => {
    let state = false;

    const proxyError = { ...error };

    if (!user.user.replace(/\s/g, "")) {
      state = true;
      proxyError.user = true;
    } else {
      proxyError.user = false;
    }

    if (!user.pass.replace(/\s/g, "")) {
      state = true;
      proxyError.pass = true;
    } else {
      proxyError.pass = false;
    }

    if (!user.email.replace(/\s/g, "")) {
      state = true;
      proxyError.email = true;
    } else {
      proxyError.email = false;
    }

    setError({ ...proxyError });
    return state;
  };
  const registerReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInput()) {
      throw "invalid input";
    }

    dispatch({ type: "REGISTER", payload: user });
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginInputContainer}
        onSubmit={(e) => registerReq(e)}
      >
        <div className={styles.loginInput}>
          <ValidInput
            value={user.user}
            setValue={(par) => {
              setUser({ ...user, user: par });
            }}
            label="username"
            inputStyle={{ width: "250px" }}
            error={{ label: "invalid username", state: error.user }}
          />

          <ValidInput
            value={user.pass}
            setValue={(par) => {
              setUser({ ...user, pass: par });
            }}
            label="password"
            inputStyle={{ width: "250px" }}
            error={{ label: "invalid password", state: error.pass }}
          />

          <ValidInput
            value={user.email}
            setValue={(par) => {
              setUser({ ...user, email: par });
            }}
            label="email"
            inputStyle={{ width: "250px" }}
            error={{
              label: registerError.isError
                ? registerError.lable
                : "invalid email",
              state: registerError.isError
                ? registerError.isError
                : error.email,
            }}
          />
        </div>
        <div className={styles.loginButton}>
          <button className={styles.actionButton} type="submit">
            create
          </button>

          <div className={styles.loginLink}>
            <Link to={"/login"} className="Link">
              login
            </Link>
            <Link to={"/"} className="Link">
              continue without account
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
