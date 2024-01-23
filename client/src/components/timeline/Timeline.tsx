import styles from "./Timeline.module.css";

import TimelineMonth from "./TimelineMonth/TimelineMonth";
import { MonthLine } from "./TimelineMonth/TimelineMonth";

type MonthDate = Record<
  number,
  { month: string; day: number; weeks: number; startDay: number }
>;

const monthDate: MonthDate = {
  0: { month: "jan", day: 31, weeks: Math.floor(31 / 7), startDay: 0 },
  1: { month: "feb", day: 28, weeks: Math.floor(28 / 7), startDay: 31 }, // Assuming a non-leap year for simplicity
  2: { month: "mar", day: 31, weeks: Math.floor(31 / 7), startDay: 59 },
  3: { month: "apr", day: 30, weeks: Math.floor(30 / 7), startDay: 90 },
  4: { month: "may", day: 31, weeks: Math.floor(31 / 7), startDay: 120 },
  5: { month: "jun", day: 30, weeks: Math.floor(30 / 7), startDay: 151 },
  6: { month: "jul", day: 31, weeks: Math.floor(31 / 7), startDay: 181 },
  7: { month: "aug", day: 31, weeks: Math.floor(31 / 7), startDay: 212 },
  8: { month: "sep", day: 30, weeks: Math.floor(30 / 7), startDay: 243 },
  9: { month: "oct", day: 31, weeks: Math.floor(31 / 7), startDay: 273 },
  10: { month: "nov", day: 30, weeks: Math.floor(30 / 7), startDay: 304 },
  11: { month: "dec", day: 31, weeks: Math.floor(31 / 7), startDay: 334 },
};

import { useParams } from "react-router-dom";

export default function Timeline() {
  const { month } = useParams();

  console.log(month);
  return (
    <div className={styles.container}>
      <TimelineSVG />
      <TodayTracker />

      <div className={styles.timeLineMonthContainer}>
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

      <div>
        {Object.keys(monthDate).map((_: string, index: number) => {
          return (
            <MonthLine key={index} monthData={monthDate[index]} index={index} />
          );
        })}
        {/* <MonthLine /> */}
      </div>
    </div>
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

  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = dateFormatter.format(date);

  return (
    <div className={styles.todayContainer} style={{ left: `${todayPercent}%` }}>
      <div className={styles.today}></div>
      <span className={styles.todayDate}>
        <p>{formattedDate}</p>
      </span>
    </div>
  );
}

function TimelineSVG() {
  return (
    <svg className={styles.timelineSVG}>
      <line
        x1="0"
        y1="50%"
        x2="100%"
        y2="50%"
        style={{ stroke: "rgb(150,150,150)", strokeWidth: "2" }}
      />
    </svg>
  );
}
