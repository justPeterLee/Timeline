import styles from "./User.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import use
// import { current } from "../../tools/data";

import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Links";
export default function Registar() {
  const dispatch = useDispatch();

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

  const registerReq = (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    dispatch({ type: "REGISTER", payload: user });
    // console.log(user);
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
            errorLabel="invalid user"
            error={{ custom: error.user }}
          />

          <ValidInput
            value={user.pass}
            setValue={(par) => {
              setUser({ ...user, pass: par });
            }}
            label="password"
            inputStyle={{ width: "250px" }}
            error={{ custom: error.pass }}
            errorLabel="invaild password"
          />

          <ValidInput
            value={user.email}
            setValue={(par) => {
              setUser({ ...user, email: par });
            }}
            label="email"
            inputStyle={{ width: "250px" }}
            error={{ custom: error.email }}
            errorLabel="invalid email"
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
            <Link to={"/sign-up"} className="Link">
              forgot password
            </Link>
          </div>
        </div>
      </form>
      {/* <UserDateLine /> */}
    </div>
  );
}
