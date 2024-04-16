import { useNavigate } from "react-router-dom";
import styles from "./TLComponents.module.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

export function YearNavigation({ year }: { year: number }) {
  const navigate = useNavigate();

  return (
    <div className={styles.YearNav}>
      <button
        onClick={() => {
          navigate(`/year/${year - 1}/view`);
        }}
      >
        <MdOutlineArrowBackIos color={"rgb(150,150,150)"} />
      </button>

      <div className={styles.YearNavText}>{year}</div>

      <button
        onClick={() => {
          navigate(`/year/${year + 1}/view`);
        }}
      >
        <MdOutlineArrowForwardIos color={"rgb(150,150,150)"} />
      </button>
    </div>
  );
}
