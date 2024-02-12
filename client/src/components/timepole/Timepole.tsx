import styles from "./Timepole.module.css";
import { useEffect, useState } from "react";
import { getDayOfYear } from "date-fns";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getWeek, getPoleData, getPoleDataList } from "../../tools/data";
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

// import {}
export function TimePoleDisplay() {
  const dispatch = useAppDispatch();

  const poles = useAppSelector((store) => store.timepole.getTimePole);

  const [poleData, setPoleData] = useState(getPoleDataList(poles, "year"));

  // console.log(poles);
  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
    // dispatch({ type: "SET_POLES_DATA", payload: "year" });
    console.log(getPoleDataList(poles, "year"));
    setPoleData(getPoleDataList(poles, "year"));
    // console.log(poleData);
  }, [dispatch]);
  return (
    <div className={styles.timePoleDisplayContainer}>
      {JSON.stringify(poleData)}
      {Object.keys(poleData).map((_, index) => {
        console.log(index);
        return <></>;
      })}

      {poles.map((pole: Pole) => {
        const xPercent = getPoleData(pole, "year");
        // console.log(xPercent);
        return (
          <TimepoleMarker
            key={pole.id}
            xPercent={xPercent.xPercent}
            timePoleData={{ title: xPercent.weekNumber }}
          />
        );
      })}
      <Timepole />
    </div>
  );
}

export function TimepoleMarker({
  xPercent,
  timepoleConfig,
  timePoleData,
}: // timepoleData,
{
  xPercent: number;
  timepoleConfig?: { height?: string };
  timePoleData: { title: number };
}) {
  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
    >
      <Timepole height={timepoleConfig?.height} />
      <div className={styles.textContainer}>{timePoleData.title}</div>
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
