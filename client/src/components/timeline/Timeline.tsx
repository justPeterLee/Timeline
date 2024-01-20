import styles from "./Timeline.module.css";

import TimelineMonth from "./TimelineMonth/TimelineMonth";

type MonthData = {
  month: string;
  day: number;
  weeks: number;
};

type MonthDate = {
  [key: number]: MonthData;
};

const monthDate: MonthDate = {
  0: { month: "January", day: 31, weeks: Math.floor(31 / 7) },
  1: { month: "February", day: 28, weeks: Math.floor(28 / 7) }, // Assuming a non-leap year for simplicity
  2: { month: "March", day: 31, weeks: Math.floor(31 / 7) },
  3: { month: "April", day: 30, weeks: Math.floor(30 / 7) },
  4: { month: "May", day: 31, weeks: Math.floor(31 / 7) },
  5: { month: "June", day: 30, weeks: Math.floor(30 / 7) },
  6: { month: "July", day: 31, weeks: Math.floor(31 / 7) },
  7: { month: "August", day: 31, weeks: Math.floor(31 / 7) },
  8: { month: "September", day: 30, weeks: Math.floor(30 / 7) },
  9: { month: "October", day: 31, weeks: Math.floor(31 / 7) },
  10: { month: "November", day: 30, weeks: Math.floor(30 / 7) },
  11: { month: "December", day: 31, weeks: Math.floor(31 / 7) },
};

export default function Timeline() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.timeline} />

        <TodayTracker />

        {Object.keys(monthDate).map((_instance: string, index: number) => {
          return (
            <TimelineMonth
              key={index}
              monthData={monthDate[index]}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
}

function TodayTracker() {
  function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    return Math.floor(diff / oneDay);
  }

  const currentDate = new Date();
  const dayOfYear = getDayOfYear(currentDate);
  const todayPercent = (100 / 365) * dayOfYear;

  return (
    <div className={styles.todayContainer} style={{ left: `${todayPercent}%` }}>
      <div className={styles.today}></div>
    </div>
  );
}
