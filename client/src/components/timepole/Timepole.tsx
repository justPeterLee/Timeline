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

                // if (isGroup) console.log(_pole);

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
    </div>
  );
}

import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
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
  const yPos = useRef(0);
  // const poleH
  const [isMoving, setIsMoving] = useState(false);
  const [poleHeight, setPoleHeight] = useState(0);
  const [{ y, height }, api] = useSpring(() => ({
    y: 10,
    height: 0,
  }));
  const bind = useDrag(({ down, movement, movement: [, my], delta }) => {
    if (!down) {
      setIsMoving(false);
      if (yPos.current === 0) {
        // console.log("run");
        yPos.current = my;
        // setPoleHeight(my)
      } else {
        yPos.current = my + yPos.current;
        // setPoleHeight(poleHeight + my)
      }
    }

    if (down) {
      setPoleHeight(my);
      setIsMoving(true);
      // console.log(delta, movement);
      api.start({ y: my + yPos.current, height: my + yPos.current });
    }
    console.log(height);
  });

  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
    >
      {/* {<AnimatedTimePole isMoving={isMoving} points={{ point1, point2 }} />} */}

      <animated.div
        className={styles.animatedTimePole}
        style={{
          // thrans,
          height,
          transform: "rotate(180deg)",
          // transform:
          transformOrigin: "top",
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        style={{ y, touchAction: "pan-y" }}
        className={styles.textContainer}
      >
        {timePoleData.id}
      </animated.div>

      {/* {poleHeight < 0 && (
        <animated.div
          className={styles.animatedTimePole}
          style={{ height }}
        ></animated.div>
      )} */}
    </div>
  );
}

import { useState } from "react";
export function Timepole() {
  return <div className={styles.timepole}></div>;
}

export function AnimatedTimePole({
  isMoving,
  points,
}: {
  isMoving: boolean;
  points: { point1: any; point2: any };
}) {
  console.log(points.point1);
  return <animated.div className={styles.animatedTimePole}></animated.div>;
}
