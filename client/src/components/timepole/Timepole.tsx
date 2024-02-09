import styles from "./Timepole.module.css";
import { useEffect } from "react";
import { getDayOfYear } from "date-fns";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getWeek } from "../../tools/data";
interface Pole {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  date: number;
  month: number;
  year: number;
  day: number;
  full_date: string;
}

export function TimePoleDisplay() {
  const dispatch = useAppDispatch();

  const poles = useAppSelector((store) => store.timepole.getTimePole);

  // console.log(poles);
  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, [dispatch]);
  return (
    <div className={styles.timePoleDisplayContainer}>
      {poles.map((pole: Pole) => {
        const date = new Date(pole.full_date); // full date
        // console.log();
        // getWeek(new Date("2025-1-3"));
        console.log(getWeek(new Date("2024-12-30")));
        const dayOfYear = getDayOfYear(date); // NUMBER (0/365)
      })}
      <Timepole />
    </div>
  );
}

export function TimepoleMarker({
  xPercent,
  timepoleConfig,
  timepoleData,
}: {
  xPercent: number;
  timepoleConfig?: { height?: string };
  timepoleData: { title: string };
}) {
  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
    >
      <Timepole height={timepoleConfig?.height} />
      <div className={styles.textContainer}>{timepoleData.title}</div>
    </div>
  );
}

export function Timepole({ height }: { height?: string }) {
  return (
    <div
      className={styles.timepole}
      style={{ height: height ? height : "" }}
    ></div>
  );
}
