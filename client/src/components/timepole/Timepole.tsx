import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef } from "react";
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

export function TimePoleDisplay({ url }: { url: string | undefined }) {
  const dispatch = useAppDispatch();
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  const urlView = url ? url : "year";
  const poleDatas = getPoleDataList(poles, urlView);

  const yPosRef = useRef(0);
  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
    yPosRef.current = 200;
  }, [dispatch]);

  // useEffect(()=>{},[])

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
                    yPosRef={yPosRef.current}
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
export function TimepoleMarker({
  xPercent,
  // timepoleConfig,
  timePoleData,
  yPosRef,
}: {
  xPercent: number;
  // timepoleConfig?: { height?: string };
  timePoleData: Pole;
  yPosRef: number;
}) {
  const yPos = useRef(yPosRef);
  const [{ y, height }, api] = useSpring(() => ({
    y: yPosRef,
    height: 0,
  }));

  const bind = useDrag(({ down, movement: [, my] }) => {
    if (!down) {
      yPos.current = my + yPos.current;
    }

    if (down) {
      api.start({ y: my + yPos.current, height: my + yPos.current });
    }
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
    </div>
  );
}

export function Timepole() {
  return <div className={styles.timepole}></div>;
}

export function AnimatedTimePole() {
  return <animated.div className={styles.animatedTimePole}></animated.div>;
}
