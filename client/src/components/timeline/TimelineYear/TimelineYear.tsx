import styles from "./TimelineYear.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { month_data, current } from "../../../tools/data";
import {
  TodayTrackerYear,
  CreateTimeline,
  WeekMarkers,
} from "../timeline_components/TimelineComponents";

import { TimePoleDisplay } from "../../timepole/Timepole";

import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/redux-hooks/redux.hook";
export default function TimelineYearPage() {
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  const dispatch = useAppDispatch();
  const { mode } = useParams();

  useEffect(() => {}, [location.pathname]);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, []);

  // useEffect(() => {
  // }, [dispatch]);
  if (poles[0] === "loading") return <></>;

  return (
    <>
      <WeekMarkers />
      <TodayTrackerYear accurate={false} />
      {mode === "view" || !mode ? (
        <MonthDivYearContainer />
      ) : (
        <CreateTimeline />
      )}
      <MonthMarkersYearContainer />
      <TimePoleDisplay url={"year"} poles={poles} />
    </>
  );
}

// Month Markers (year page)
export function MonthMarkersYearContainer() {
  return (
    <div className={styles.timeLineMonthLine}>
      {Object.keys(month_data).map((_: string, index: number) => {
        return (
          <MonthMarkerYear
            key={index}
            monthData={month_data[index]}
            index={index}
          />
        );
      })}
    </div>
  );
}

export function MonthMarkerYear({
  monthData,
  index,
}: {
  monthData: { month: string; day: number; weeks: number; startDay: number };
  index: number;
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
        onClick={() => {
          navigate(monthRoute);
        }}
      >
        <p>{monthData.month}</p>
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
export function MonthDivYearContainer() {
  return (
    <div className={styles.timeLineMonthContainer}>
      {Object.keys(month_data).map((_instance: string, index: number) => {
        return (
          <MonthDivYear
            key={index}
            monthData={month_data[index]}
            index={index}
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
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;
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
    >
      <div className={styles.container}></div>
    </div>
  );
}
