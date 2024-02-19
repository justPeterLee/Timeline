import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef, useState } from "react";
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

  const [selectedPole, setSelectedPole] = useState<null | number>(null);

  const onClose = () => {
    setSelectedPole(null);
  };

  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
    yPosRef.current = 200;
  }, [dispatch]);

  return (
    <>
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
                      setSelectedPole={(id) => {
                        setSelectedPole(id);
                      }}
                    />
                  );
                }
              )}
            </Fragment>
          );
        })}
      </div>
      {selectedPole && (
        <Modal onClose={onClose}>
          <div>
            modal dialog <button onClick={onClose}>close</button>
          </div>
        </Modal>
      )}
    </>
  );
}

import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
export function TimepoleMarker({
  xPercent,
  timePoleData,
  yPosRef,

  setSelectedPole,
}: {
  xPercent: number;
  timePoleData: Pole;
  yPosRef: number;
  setSelectedPole: (id: number) => void;
}) {
  const wasDragging = useRef(false);

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
      if (!wasDragging.current && (my > 5 || my < -5)) {
        wasDragging.current = true;
        console.log("changed", wasDragging.current);
      }
      api.start({ y: my + yPos.current, height: my + yPos.current });
    }

    // console.log(my);
  });

  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
      onClick={() => {
        if (!wasDragging.current) {
          setSelectedPole(parseInt(timePoleData.id));
        }
        wasDragging.current = false;
      }}
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
