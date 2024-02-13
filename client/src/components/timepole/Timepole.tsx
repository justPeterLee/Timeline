import styles from "./Timepole.module.css";
import { useEffect, Fragment } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getPoleDataList } from "../../tools/data";
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

  const poleDatas = getPoleDataList(poles, "year");

  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, [dispatch]);
  return (
    <div className={styles.timePoleDisplayContainer}>
      {Object.keys(poleDatas).map((_key, index) => {
        return (
          <Fragment key={index}>
            {poleDatas[_key].polesList.map(
              (_pole: { pole: Pole; xPercent: number }) => {
                const isGroup =
                  poleDatas[_key].polesList.length >= 3 ? true : false;

                if (isGroup) console.log(_pole);

                return (
                  <TimepoleMarker
                    key={_pole.pole.id}
                    xPercent={
                      isGroup ? poleDatas[_key].midPoint : _pole.xPercent
                    }
                    timePoleData={_pole.pole}
                  />
                );
              }
            )}
          </Fragment>
        );
      })}

      {/* {poles.map((pole: Pole) => {
        const xPercent = getPoleData(pole, "year");
        // console.log(xPercent);
        return (
          <TimepoleMarker
            key={pole.id}
            xPercent={xPercent.xPercent}
            timePoleData={{ title: xPercent.weekNumber }}
          />
        );
      })} */}
      {/* <Timepole /> */}
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
  timePoleData: Pole;
}) {
  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
    >
      <Timepole height={timepoleConfig?.height} />
      <div className={styles.textContainer}>{timePoleData.id}</div>
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
