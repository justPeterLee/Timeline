import styles from "./TimelineMonth.module.css";
import { useNavigate } from "react-router-dom";

export default function TimelineMonth({
  monthData,
  index,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;
}) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      style={{ width: `${monthData.day * 0.274}%` }}
      onClick={() => {
        navigate(`/${index + 1}`);
      }}
    >
      <span className={styles.monthAbr}>
        <div
          className={styles.monthAbrContainer}
          style={{
            transform:
              index % 2 === 0
                ? "translate(-50%, 100%)"
                : "translate(-50%, -100%)",
            alignItems: index % 2 === 0 ? "flex-end" : "flex-start",
          }}

          //   onClick={()=>{navigate(`/${index + 1 }`)}}
        >
          <p>{monthData.month}</p>
        </div>
      </span>

      <div
        className={styles.month}
        style={{ justifyContent: index % 2 <= 0 ? "flex-end" : "flex-start" }}
      >
        <div className={styles.monthLine}></div>
      </div>

      <div className={styles.weekLineContainer}>
        {Array.from({ length: monthData.weeks }, (_, index) => {
          return (
            <div
              className={styles.weekLine}
              key={index}
              style={{
                backgroundColor:
                  index === 0 ? "transparent" : "rgb(200, 200, 200)",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
