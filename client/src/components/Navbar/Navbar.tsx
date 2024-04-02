import { useState } from "react";
import styles from "./Navbar.module.css";
import { FiMenu } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";

import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [togglePage, setTogglePage] = useState(false);

  //   console.log(user);
  return (
    <div className={styles.Navbar}>
      <div className={styles.NavbarMenu}>
        <button
          className={styles.NavbarMenuButton}
          onClick={() => {
            console.log("hello");
            setTogglePage(!togglePage);
          }}
        >
          <FiMenu size={17} color="rgb(70,70,70)" />
        </button>

        {togglePage && <NavbarMenuPage />}
      </div>
      {/* {user.id && <NavbarUser username={user.username} />} */}
    </div>
  );
}

function NavbarMenuPage() {
  const user = useAppSelector((store) => store.userAccount);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className={styles.NavbarMenuPage}>
      {user.id ? (
        <>
          <NavbarMenuButton
            icon={<FaRegUser size={15} />}
            text={user.username}
            link={() => {
              navigate("/user");
            }}
          />
          <NavbarMenuButton
            icon={<PiSignOutBold size={15} color={"red"} />}
            text="Sign out"
            link={() => {
              dispatch({ type: "LOGOUT" });
              navigate("/");
            }}
            style={{ color: "red" }}
          />
        </>
      ) : (
        <NavbarMenuButton
          icon={<MdLockOutline size={15} />}
          text={"Login"}
          link={() => {
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}

function NavbarMenuButton({
  icon,
  text,
  link,
  style = {},
}: {
  icon: JSX.Element;
  text: string;
  link: () => void;
  style?: { color?: string };
}) {
  return (
    <button className={styles.MenuButton} onClick={link}>
      <div className={styles.MenuIcon}>{icon}</div>
      <div className={styles.MenuText} style={{ ...style }}>
        {text}
      </div>
    </button>
  );
}

function NavbarUser({ username }: { username: string }) {
  return (
    <div className={styles.NavbarUser}>
      <div className={styles.NavbarUserIcon}>
        <FaRegUser size={25} />
      </div>
      <div className={styles.NavbarUserText}>{username}</div>
    </div>
  );
}
