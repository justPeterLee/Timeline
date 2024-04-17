import styles from "./Timeline.module.css";
import { animated, to } from "react-spring";
import {
  current,
  monthByDate,
  monthByIndex,
} from "../../../tools/data/monthData";
import { TimelineSpringValue } from "./Timeline";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";

function MarkerMonth({
  timelineSpring,
  left,
  month,
}: {
  timelineSpring: TimelineSpringValue;
  left: number;
  month: number;
}) {
  const { year, mode } = useParams();
  const navigate = useNavigate();
  const monthData = monthByIndex[month];

  return (
    <animated.div
      style={{
        left: `${left}%`,
        transformOrigin: "center left",
        transform: to(
          [timelineSpring.scale, timelineSpring.markerX],
          (scale, x) =>
            `scaleX(${1 / scale}) translate(${x}px,${month % 2 != 0 ? 0 : 0}px)`
        ),
      }}
      className={styles.Markers}
      id={`marker-month-${month}`}
    >
      <span
        className={styles.MonthAbbr}
        style={month === 1 ? { transform: "none" } : {}}
        onClick={() => {
          if (mode === "view" || !mode) {
            navigate(`/month/${year ? year : current.year}/${month}/view`);
          }
        }}
      >
        <p>{monthData.abb}</p>
      </span>
    </animated.div>
  );
}

function MarkerWeek({
  timelineSpring,
  left,
  week,
}: // monthPos,
{
  timelineSpring: TimelineSpringValue;
  left: number;
  week: number;
  // monthPos: number;
}) {
  return (
    <animated.div
      style={{
        left: `${left}%`,
        transformOrigin: "center left",
        transform: to(
          [timelineSpring.scale, timelineSpring.markerX],
          (scale, x) => `scaleX(${1 / scale}) translate(${x}px, 0px)`
        ),
      }}
      className={styles.MarkerWeek}
      id={`marker-week-${week}`}
    ></animated.div>
  );
}

function MarkerDay({
  timelineSpring,
  left,
  day,
  monthPos,
  currMonth,
  mode,
}: {
  timelineSpring: TimelineSpringValue;
  left: number;
  day: number;
  monthPos: number;
  currMonth: number;
  mode: string;
}) {
  return (
    <>
      {(monthPos <= currMonth + 1 &&
        monthPos >= currMonth - 1 &&
        currMonth != -1) ||
      mode === "create" ? (
        <animated.div
          style={{
            left: `${left}%`,
            transformOrigin: "center left",
            transform: to(
              [timelineSpring.scale, timelineSpring.markerX],
              (scale, x) => `scaleX(${1 / scale}) translate(${x}px, 0px)`
            ),
          }}
          className={styles.MarkerDay}
          id={`marker-day-${day}`}
        ></animated.div>
      ) : (
        <></>
      )}
    </>
  );
}

export function MarkerAllContainer({
  timelineSpring,
}: {
  timelineSpring: TimelineSpringValue;
}) {
  const { month, mode } = useParams();
  let monthTracker = 0;
  let week = 0;
  return (
    <>
      {Array.from({ length: 365 }, (_, index) => {
        const normalizeDay = index + 1;

        let indexMonth = -1;
        let indexWeek = -1;
        const indexDay = normalizeDay;

        const left = (100 / 365) * index;

        if (monthByDate[normalizeDay]) {
          monthTracker += 1;
          indexMonth = monthTracker;
        }

        if (normalizeDay % 7 === 0) {
          week += 1;
          indexWeek = week;
        }

        if (indexMonth > 0) {
          return (
            <MarkerMonth
              key={index}
              timelineSpring={timelineSpring}
              left={left}
              month={indexMonth}
            />
          );
        } else if (indexWeek > 0) {
          return (
            <MarkerWeek
              key={index}
              timelineSpring={timelineSpring}
              left={left}
              week={indexWeek}
              // monthPos={monthTracker}
            />
          );
        } else {
          return (
            <Fragment key={index}>
              <MarkerDay
                key={index}
                timelineSpring={timelineSpring}
                left={left}
                day={indexDay}
                monthPos={monthTracker}
                currMonth={month ? parseInt(month) : -1}
                mode={!mode ? "view" : mode}
              />
            </Fragment>
          );
        }
      })}
    </>
  );
}
