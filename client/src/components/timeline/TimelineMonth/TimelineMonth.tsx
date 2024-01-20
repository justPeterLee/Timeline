import styles from "./TimelineMonth.module.css";

export default function TimelineMonth({
  monthData,
  index,
}: {
  monthData: { month: string; day: number };
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
    </div>
  );
}
