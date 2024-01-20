import styles from "./TimelineMonth.module.css";

export default function TimelineMonth({
  monthData,
  index,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;
}) {
  return (
    <div
      className={styles.container}
      style={{ width: `${monthData.day * 0.274}%` }}
    >
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
