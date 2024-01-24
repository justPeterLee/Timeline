import styles from "./Timeline.module.css";

import {
  TimelineYearView,
  TimelineMonthView,
} from "./TimelineMonth/TimelineMonth";

import { MonthLine } from "./TimelineMonth/TimelineMonth";
import { useEffect, useState } from "react";
import { month_data, current } from "../../tools/data";
import { useAnimationTransition } from "../../tools/hooks/useTransition";
import { useParams, useLocation } from "react-router-dom";
export default function Timeline() {
  useAnimationTransition();

  const location = useLocation();
  const { month } = useParams();

  const [monthSelected, setMonthSelected] = useState<number>(-1);

  const setSelectedMonth = (index: number) => {
    setMonthSelected(() => index);
  };

  const [monthSelectedData, setMonthSelectedData] = useState<null | {
    current: {
      month: string;
      day: number;
      weeks: number;
      startDay: number;
      index: number;
    };
    previous: {
      month: string;
      day: number;
      weeks: number;
      startDay: number;
      index: number;
    };
    following: {
      month: string;
      day: number;
      weeks: number;
      startDay: number;
      index: number;
    };
  }>(null);
  const selectedMonthData = () => {
    const monthInt = month ? parseInt(month) : -1;
    const current = monthInt - 1;
    const following = monthInt < 11 ? monthInt : 0;
    const previous = monthInt > 1 ? monthInt - 2 : 11;

    setMonthSelectedData(() => {
      return {
        previous: month_data[previous],
        current: month_data[current],
        following: month_data[following],
      };
    });
  };

  useEffect(() => {
    setSelectedMonth(-1);
    selectedMonthData();
    // console.log(selectedMonthData());
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <TimelineSVG />
      <TodayTracker />

      {!month || month === "0" ? (
        <TimelineYearView
          selectMonth={setSelectedMonth}
          selectedMonth={monthSelected}
        />
      ) : monthSelectedData ? (
        <TimelineMonthView viewMonth={monthSelectedData} />
      ) : (
        <></>
      )}

      <div className={styles.timeLineMonthLine}>
        {Object.keys(month_data).map((_: string, index: number) => {
          return (
            <MonthLine
              key={index}
              monthData={month_data[index]}
              index={index}
              selectMonth={setSelectedMonth}
              selectedMonth={monthSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

function TodayTracker() {
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
