import styles from "./User.module.css";
import { useState } from "react";
// import { current } from "../../tools/data";

import { Link } from "react-router-dom";
import { ValidInput } from "../../components/elements/Elements";
import { useDispatch } from "react-redux";

import { useEffect } from "react";
export default function LoginPage() {
  const dispatch = useDispatch();
  // console.log(current);
  const [user, setUser] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [isError, setIsError] = useState(false);

  const validateInput = () => {
    if (!user.username.replace(/\s/g, "")) {
      setIsError(true);
      return true;
    } else {
      setIsError(false);
    }
    return false;
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
            label="username / email"
            value={user.username}
            setValue={(par) => {
              setUser({ ...user, username: par });
            }}
            inputStyle={{ width: "250px" }}
            error={{ label: "invalid username", state: isError }}
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
