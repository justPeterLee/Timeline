import styles from "./TimePolesTimeline.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  StandardPoleData,
  generatePoleKey,
} from "../../../tools/utilities/timepoleUtils/timepoleUtils";
import { getPoleDataList } from "../../../tools/data";
import {
  extractPoleData,
  sort,
} from "../../../tools/utilities/timepoleUtils/timepole";
import { animated, to } from "react-spring";

export function TimePolesTimeline({
  poles,

  func,
}: //   showPoles,
{
  poles: StandardPoleData[];
  func: {
    onOpenSelectedPole: (_pole: StandardPoleData) => void;
    onOpenSelectedGroupPole: (_pole: StandardPoleData[]) => void;
  };
  //   showPoles: StandardPoleData[];
}) {
  const poleData = useMemo(() => {
    const polesData = getPoleDataList(poles, "year");

    return polesData;
  }, [poles]);

  const extractedPoleDatas = useMemo(() => {
    return extractPoleData(poleData);
  }, [poleData]);

  const localSortData = window.localStorage.getItem("localSortData");

  const [localState, setLocalState] = useState(localSortData);

  useEffect(() => {
    if (!localSortData) {
      // console.log(localSortData, "need update");
      const newSortData = sort(poleData);
      // console.log(newSortData);
      const jsonSortData = JSON.stringify(newSortData);
      window.localStorage.setItem("localSortData", jsonSortData);
      const localSortDatas = window.localStorage.getItem("localSortData");

      // const jsonData = JSON.stringify("hello");

      setLocalState(localSortDatas);
    }
  }, []);
  return (
    <>
      {Object.keys(extractedPoleDatas).map((_poleKey, index) => {
        const _pole = extractedPoleDatas[_poleKey];
        const genPoleKey = generatePoleKey(_poleKey);
        const parseLocalState = localState
          ? JSON.parse(localState)[genPoleKey]
          : null;

        let validSort = null;
        if (parseLocalState) {
          validSort = parseLocalState[genPoleKey];
        }
        // console.log(genPoleKey);
        // console.log("re");
        return (
          <TimePole
            key={index}
            id={genPoleKey}
            poleData={_pole}
            yPos={parseLocalState}
            setSelectedPole={func.onOpenSelectedPole}
            setSelectedGroupPole={func.onOpenSelectedGroupPole}
          />
        );
      })}
    </>
  );
}

import { useDrag } from "@use-gesture/react";
import { useSpring } from "react-spring";

function TimePole({
  id,
  poleData,
  yPos,

  setSelectedPole,
  setSelectedGroupPole,
}: {
  id: string;
  poleData: {
    id: string;
    poles: StandardPoleData[];
    xPercent: number;
  };
  yPos: { yPos: number } | null | undefined;

  setSelectedPole: (_pole: StandardPoleData) => void;
  setSelectedGroupPole: (_pole: StandardPoleData[]) => void;
}) {
  const textBubbleTarget = useRef<null | HTMLDivElement>(null);
  const yPosRef = useRef(yPos ? yPos.yPos : 0);

  const wasDragging = useRef(false);
  // const reRenderRef = useRef(0);

  const [timePoleSpring, timePoleApi] = useSpring(() => ({
    x: 0,
    y: yPosRef.current,
    scale: yPosRef.current,
  }));

  const bind = useDrag(({ down, movement: [mx, _my] }) => {
    if (textBubbleTarget.current) {
      const halfHeight =
        textBubbleTarget.current.getBoundingClientRect().height / 2;

      if (!down) {
        yPosRef.current = _my + yPosRef.current;
        timePoleApi.start({ x: 0 });
      }

      if (down) {
        if (!wasDragging.current && (_my > 5 || _my < -5)) {
          wasDragging.current = true;
        }
        // console.log(oy);
        const offsetYPos = _my + yPosRef.current;
        timePoleApi.start({
          x: mx / 10,
          y: offsetYPos,
          scale:
            offsetYPos >= 0
              ? offsetYPos - halfHeight - 5
              : offsetYPos + halfHeight + 5,
        });

        // if()
      }
    }
  });

  // only run this if yPos i changed
  useEffect(() => {
    // reRenderRef.current += 1;
    // console.log(
    //   "rerender\n",
    //   poleData.poles[0].title,
    //   "\n",
    //   reRenderRef.current
    // );
    // if (!yPosRef.current) {
    timePoleApi.set({ y: yPos ? yPos.yPos : 0, scale: yPos ? yPos.yPos : 0 });
    // }
  }, [yPos]);

  return (
    <animated.div
      className={styles.TimePole}
      style={{ left: `${poleData.xPercent}%` }}
    >
      <animated.div
        className={styles.TimePolePole}
        style={{
          transform: to([timePoleSpring.scale], (scale) => `scaleY(${scale})`),
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        id={`pole-${id}`}
        className={styles.TimePoleText}
        style={{
          transform: to(
            [timePoleSpring.x, timePoleSpring.y],
            (_x, y) => `translate(${-50 + _x}%,${y}px)`
          ),
        }}
        onClick={() => {
          if (!wasDragging.current) {
            if (poleData.poles.length > 1) {
              setSelectedGroupPole(poleData.poles);
            } else {
              setSelectedPole(poleData.poles[0]);
            }
          }
          wasDragging.current = false;
        }}
        ref={textBubbleTarget}
      >
        {poleData.poles.map((_pole, index) => {
          return (
            <p key={index} className={styles.TimePoleBubble}>
              {_pole.title}
            </p>
          );
        })}
      </animated.div>
    </animated.div>
  );
}
