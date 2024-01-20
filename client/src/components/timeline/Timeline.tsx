import styles from "./Timeline.module.css";

import TimelineMonth from "./TimelineMonth/TimelineMonth";

type MonthData = {
  month: string;
  day: number;
};

type MonthDate = {
  [key: number]: MonthData;
};
const monthDate: MonthDate = {
  0: { month: "January", day: 31 },
  1: { month: "February", day: 28 }, // Assuming a non-leap year for simplicity
  2: { month: "March", day: 31 },
  3: { month: "April", day: 30 },
  4: { month: "May", day: 31 },
  5: { month: "June", day: 30 },
  6: { month: "July", day: 31 },
  7: { month: "August", day: 31 },
  8: { month: "September", day: 30 },
  9: { month: "October", day: 31 },
  10: { month: "November", day: 30 },
  11: { month: "December", day: 31 },
};

export default function Timeline() {
  return (
    <>
      <div className={styles.timeline}>
        {Object.keys(monthDate).map((instance: string, index: number) => {
          return <TimelineMonth key={index} monthData={monthDate[index]} />;
        })}
        {/* <TimelineMonth /> */}
      </div>
    </>
  );
}
