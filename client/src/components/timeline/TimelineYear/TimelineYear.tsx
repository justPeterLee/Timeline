import styles from "./TimelineYear.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { month_data, current } from "../../../tools/data";
import {
  TodayTrackerYear,
  CreateTimeline,
  WeekMarkers,
} from "../timeline_components/TimelineComponents";

import { TimePoleDisplay } from "../../timepole/Timepole";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/redux-hooks/redux.hook";
export default function TimelineYearPage() {
  const dispatch = useAppDispatch();
  const { mode } = useParams();
  const [monthSelected, setMonthSelected] = useState<number>(-1);

  const setSelectedMonth = (index: number) => {
    setMonthSelected(() => index);
  };

  useEffect(() => {
    setSelectedMonth(-1);
  }, [location.pathname]);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, []);
  return (
    <>
      <WeekMarkers />
      <TodayTrackerYear accurate={false} />
      {mode === "view" || !mode ? (
        <MonthDivYearContainer
          selectMonth={setSelectedMonth}
          selectedMonth={monthSelected}
        />
      ) : (
        <CreateTimeline />
      )}
      <MonthMarkersYearContainer
        selectMonth={setSelectedMonth}
        selectedMonth={monthSelected}
      />
      <TimePoleDisplay url={"year"} />
    </>
  );
}

// Month Markers (year page)
export function MonthMarkersYearContainer({
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
          <MonthMarkerYear
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

export function MonthMarkerYear({
  monthData,
  index,
  selectMonth,
  selectedMonth,
}: {
  monthData: { month: string; day: number; weeks: number; startDay: number };
  index: number;

  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();

  const monthRoute = `/month/${year || current.year}/${index + 1}/${
    mode || "view"
  }`;
  return (
    <div
      id={`${index}`}
      className={styles.month}
      style={{
        top: index % 2 <= 0 ? "0%" : "-15px",
        left: `${monthData.startDay * 0.27397260274}%`,
      }}
    >
      {/* <div className={styles.monthLine}></div> */}

      <div
        className={styles.monthAbrContainer}
        style={{
          alignItems: `${index % 2 === 0 ? "flex-end" : "flex-start"}`,
          bottom: `${index % 2 === 0 ? "" : "0"}`,
          userSelect: "none",
        }}
        onMouseOver={() => {
          selectMonth(index);
          // console.log("over");
        }}
        onMouseOut={() => {
          selectMonth(-1);
        }}
        onClick={() => {
          navigate(monthRoute);
        }}
      >
        <p style={{ opacity: selectedMonth === index ? "80%" : "30%" }}>
          {monthData.month}
        </p>
      </div>
    </div>
  );
}

/**
 *
 * @param param0
 *
 *
 *
 *
 * @returns
 */

// Month Divs Container(year page)
export function MonthDivYearContainer({
  selectMonth,
  selectedMonth,
}: {
  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  return (
    <div className={styles.timeLineMonthContainer}>
      {Object.keys(month_data).map((_instance: string, index: number) => {
        return (
          <MonthDivYear
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

// Month Divs(year page)
function MonthDivYear({
  monthData,
  index,
  selectMonth,
  selectedMonth,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;

  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();

  const monthRoute = `/month/${year || current.year}/${index + 1}/${
    mode || "view"
  }`;
  return (
    <div
      className={styles.extentionContainer}
      style={{
        width: `${monthData.day * 0.27397260274}%`,
      }}
      onClick={() => {
        navigate(monthRoute);
      }}
      onMouseOver={() => {
        selectMonth(index);
      }}
      onMouseOut={() => {
        selectMonth(-1);
      }}
    >
      <div
        className={styles.container}
        style={{
          backgroundColor:
            selectedMonth === index ? "rgb(242,242,242)" : "initial",
        }}
      ></div>
    </div>
  );
}
