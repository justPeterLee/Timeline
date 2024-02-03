import styles from "./User.module.css";
import { useState } from "react";
// import { current } from "../../tools/data";

import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Links";
export default function LoginPage() {
  // console.log(current);
  const [user, setUser] = useState<{ user: string; pass: string }>({
    user: "",
    pass: "",
  });

  const [error, setError] = useState<{ user: boolean; pass: boolean }>({
    user: false,
    pass: false,
  });

  const loginReq = () => {
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
          />
        </div>
        <div className={styles.loginButton}>
          <button
            className={styles.actionButton}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              loginReq();
            }}
          >
            login
          </button>

          <div className={styles.loginLink}>
            <Link to={"/sign-up"} className="Link">
              create account
            </Link>
            <Link to={"/sign-up"} className="Link">
              forgot password
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
