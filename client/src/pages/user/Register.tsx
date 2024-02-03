import styles from "./User.module.css";
import { useState } from "react";
// import { current } from "../../tools/data";

import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Links";
export default function Registar() {
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

  const registerReq = () => {
    console.log(user);
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginInputContainer}>
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
              setUser({ ...user, pass: par });
            }}
            label="email"
            inputStyle={{ width: "250px" }}
            error={{ custom: error.email }}
            errorLabel="invalid email"
          />
        </div>
        <div className={styles.loginButton}>
          <button
            className={styles.actionButton}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              registerReq();
            }}
          >
            create
          </button>

          <div className={styles.loginLink}>
            <Link to={"/login"} className="Link">
              create account
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
