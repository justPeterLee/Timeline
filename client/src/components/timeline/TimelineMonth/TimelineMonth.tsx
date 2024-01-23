import styles from "./TimelineMonth.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function TimelineMonth({
  monthData,
  index,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();
  const currentYear = new Date().getFullYear();
  return (
    <div
      className={styles.extentionContainer}
      style={{ width: `${monthData.day * 0.274}%` }}
      onClick={() => {
        navigate(`/${year || currentYear}/${index + 1}/${mode || "view"}`);
      }}
    >
      <div className={styles.container}>
        <div
          className={styles.month}
          style={{ justifyContent: index % 2 <= 0 ? "flex-end" : "flex-start" }}
        ></div>

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
    </div>
  );
}

export function MonthLine({
  monthData,
  index,
}: {
  monthData: { month: string; day: number; weeks: number; startDay: number };
  index: number;
}) {
  return (
    <div
      className={styles.month}
      style={{
        top: index % 2 <= 0 ? "0%" : "-13px",
        left: `${monthData.startDay * 0.27397260274}%`,
      }}
    >
      <div
        className={styles.monthLine}
        style={{ left: "8.49315%", top: "50%" }}
      ></div>

      <div
        className={styles.monthAbrContainer}
        style={{
          alignItems: `${index % 2 === 0 ? "flex-end" : "flex-start"}`,
          bottom: `${index % 2 === 0 ? "" : "0"}`,
        }}
      >
        <p>{monthData.month}</p>
      </div>
    </div>
  );
}
