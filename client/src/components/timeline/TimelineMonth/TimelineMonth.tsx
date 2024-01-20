import styles from "./TimelineMonth.module.css";

export default function TimelineMonth({
  monthData,
}: {
  monthData: { month: string; day: number };
}) {
  return (
    <div className={styles.container}>
      <>
        {monthData.month} {monthData.day}
      </>
    </div>
  );
}
