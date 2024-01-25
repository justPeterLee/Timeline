import styles from "./TimelineComponents.module.css";
import { current } from "../../../tools/data";

// identifies todays date (on YEAR timeline)
export function TodayTrackerYear() {
  return (
    <div
      className={styles.todayContainer}
      style={{ left: `${current.today.percent}%` }}
    >
      <div className={styles.today}></div>
      <span className={styles.todayDate}>
        <p>{current.today.date_format}</p>
      </span>
    </div>
  );
}
