import styles from "./Timeline.module.css";
import { TodayTrackerYear } from "./timeline_components/TimelineComponents";

import {
  TimelineYearView,
  TimelineMonthView,
  MonthLineViewLine,
  MonthLine,
} from "./TimelineMonth/TimelineMonth";

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

  useEffect(() => {
    setSelectedMonth(-1);
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <TimelineSVG />
      <TodayTrackerYear />

      {!month || month === "0" ? (
        <TimelineYearView
          selectMonth={setSelectedMonth}
          selectedMonth={monthSelected}
        />
      ) : (
        <></>
        // <TimelineMonthView viewMonth={{}} />
      )}

      {!month || month === "0" ? (
        <YearLine
          selectMonth={setMonthSelected}
          selectedMonth={monthSelected}
        />
      ) : (
        <MonthLineView />
      )}
    </div>
  );
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

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

function YearLine({
  selectMonth,
  selectedMonth,
}: {
  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  return (
    <div className={styles.timeLineMonthLine}>
      {Object.keys(month_data).map((_: string, index: number) => {
        return (
          <MonthLine
            key={index}
            monthData={month_data[index]}
            index={index}
            selectMonth={selectMonth}
            selectedMonth={selectedMonth}
          />
        );
      })}
    </div>
  );
}

interface ViewMonth {
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
}

function MonthLineView() {
  const { month } = useParams();
  const selectedMonthData = () => {
    const monthInt = month ? parseInt(month) : -1;
    const current = monthInt - 1;
    const following = monthInt < 12 ? monthInt : 0;
    const previous = monthInt > 1 ? monthInt - 2 : 11;
    return {
      previous: month_data[previous],
      current: month_data[current],
      following: month_data[following],
    };
  };

  const data = selectedMonthData();
  return (
    <div className={styles.timeLineMonthLine}>
      {/* {JSON.stringify(viewMonth)} */}
      {Object.keys(data).map((_state: string, index: number) => {
        return (
          <MonthLineViewLine
            key={index}
            state={_state}
            data={data[_state as keyof ViewMonth]}
          />
        );
      })}
    </div>
  );
}
