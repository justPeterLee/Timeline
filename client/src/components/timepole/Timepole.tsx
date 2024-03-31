import styles from "./Timepole.module.css";
import { useEffect, useRef, useState, useMemo } from "react";
import { getPoleDataList } from "../../tools/data";
import {
  sort,
  compareSortPoles,
  sortDataUpdater,
  extractPoleData,
} from "../../tools/utilities/timepoleUtils/timepole";

import {
  PoleCordsData,
  PoleData,
  StandardPoleData,
  generatePoleKey,
} from "../../tools/utilities/timepoleUtils/timepoleUtils";

// let sortDataConst: PoleCordsData | (() => PoleCordsData) | null = null;
export function TimePoleDisplay({
  url,
  poles,
  timelineSpring,
}: {
  url: "year" | "month";
  poles: StandardPoleData[];
  timelineSpring: TimelineSpringValue;
}) {
  const urlView = url ? url : "year";

  const poleDatas: PoleData = useMemo(() => {
    return getPoleDataList(poles, urlView);
  }, [poles, urlView]);

  const extractedPoleDatas: any = useMemo(() => {
    return extractPoleData(poleDatas);
  }, [poleDatas]);

  // console.log(extractedPoleDatas);

  const localStorageData = window.localStorage.getItem("sortDataEffect");

  const [sortData, setSortData] = useState<PoleCordsData>(
    localStorageData ? JSON.parse(localStorageData) : {}
  );

  const [selectedPole, setSelectedPole] = useState<null | StandardPoleData>(
    null
  );
  const [selectedGroupPole, setSelectedGroupPole] = useState<
    null | StandardPoleData[]
  >(null);

  const onOpenSelectedPole = (_pole: StandardPoleData) => {
    // onCloseGroupPole();
    setSelectedPole(_pole);
  };
  const onClose = () => {
    setSelectedPole(null);
    setSelectedGroupPole(null);
  };
  const onOpenSelectedGroupPole = (_pole: StandardPoleData[]) => {
    setSelectedGroupPole(_pole);
  };

  const updateWindowSort = (data: string) => {
    window.localStorage.setItem("sortDataEffect", data);
  };

  const updateSortData = (_pole: { id: string; yPos: number }) => {
    const proxyLocalData = sortData;
    proxyLocalData[_pole.id] = { yPos: _pole.yPos };

    const jsonSortData = JSON.stringify(proxyLocalData);
    updateWindowSort(jsonSortData);
    setSortData(JSON.parse(jsonSortData));
  };

  const deleteSortData = (_pole: { id: string }) => {
    console.log(_pole);
    const proxyLocalData = sortData;

    if (proxyLocalData[_pole.id]) {
      delete proxyLocalData[_pole.id];
    }

    const jsonSortData = JSON.stringify(proxyLocalData);
    updateWindowSort(jsonSortData);
  };

  useEffect(() => {
    //check if sort data already exist
    // console.log(poleDatas);
    const localStorageData = window.localStorage.getItem("sortDataEffect");
    if (localStorageData && localStorageData !== undefined) {
      const jsonLocalStorageData: PoleCordsData = JSON.parse(localStorageData);
      const addPoles = compareSortPoles(poles, jsonLocalStorageData);

      // console.log(addPoles);
      // if (addPoles.addArray.length || addPoles.deleteArray.length) {
      //   const updatedSortData = sortDataUpdater(
      //     addPoles,
      //     jsonLocalStorageData,
      //     poles,
      //     url
      //   );
      //   updateWindowSort(updatedSortData);
      // }
    } else {
      // create sort data
      if (!Object.keys(poleDatas).length) {
        return;
      }
      const newSortDatas = sort(poleDatas);
      // console.log(newSortDatas);
      const jsonSortData = JSON.stringify(newSortDatas);
      updateWindowSort(jsonSortData);
    }
  }, [poleDatas]);

  useEffect(() => {
    // console.log("window");
  }, []);

  return (
    <>
      <div className={styles.timePoleDisplayContainer} id={"asdf"}>
        {Object.keys(extractedPoleDatas).map((_dateKey, index) => {
          const poleKey = generatePoleKey(_dateKey);
          const _pole = extractedPoleDatas[_dateKey];
          const sortIsNull = sortData === null ? null : sortData[poleKey];

          return (
            <TimepoleMarker
              key={index}
              id={poleKey}
              xPercent={_pole.xPercent}
              timePoleDataArr={_pole.poles}
              yPos={sortIsNull}
              setSelectedPole={onOpenSelectedPole}
              setSelectedGroupPole={onOpenSelectedGroupPole}
              updateSortData={(_pole: { id: string; yPos: number }) => {
                updateSortData(_pole);
              }}
              timelineSpring={timelineSpring}
            />
          );
        })}
      </div>
      {selectedPole && (
        <Modal onClose={onClose} styles={{ minWidth: "20rem" }}>
          <TimePoleModal
            onClose={onClose}
            timePoleData={selectedPole}
            deleteSortData={deleteSortData}
          />
        </Modal>
      )}
      {selectedGroupPole && (
        <GroupTimePoleSelectionModal
          timePoleDataArr={selectedGroupPole}
          setSelectedPole={onOpenSelectedPole}
          onClose={onClose}
        />
      )}
    </>
  );
}

import { useSpring, animated, to as interpolate, to } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
import { GroupTimePoleSelectionModal, TimePoleModal } from "../modals/Modals";
import { TimelineSpringValue } from "../Timelines/Timeline/Timeline";
export function TimepoleMarker({
  id,
  xPercent,
  timePoleDataArr,
  yPos,
  timelineSpring,

  setSelectedPole,
  setSelectedGroupPole,
  updateSortData,
}: {
  id: string;
  xPercent: number;
  timePoleDataArr: StandardPoleData[];
  yPos: { yPos: number } | null;
  timelineSpring: TimelineSpringValue;

  setSelectedPole: (_pole: StandardPoleData) => void;
  setSelectedGroupPole: (_pole: StandardPoleData[]) => void;
  updateSortData: (_pole: { id: string; yPos: number }) => void;
}) {
  // console.log(yPos);
  const wasDragging = useRef(false);
  const yPosRef = useRef(yPos ? yPos.yPos : 100);
  const targetElement = useRef<HTMLDivElement>(null);

  const yPosNull = yPos;

  if (!yPosNull) {
    const localSortData = window.localStorage.getItem("sortDataEffect");

    if (localSortData !== null) {
      console.log(timePoleDataArr);
      console.log("need to generate sort data", id);
    } else {
      console.log("sort data doesnt exists");
      return;
    }

    // console.log(localSortData);
    // console.log("generate sort data");
  }

  const yPosMemo = useMemo(() => {
    yPosRef.current = yPos ? yPos.yPos : -100;
    return yPos ? yPos.yPos : -100;
  }, [yPos]);

  const [{ x, y, scale }, api] = useSpring(() => ({
    y: yPosMemo,
    x: 0,
    scale: 0,
  }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (!down) {
      // updator
      yPosRef.current = my + yPosRef.current;

      if (targetElement.current) {
        //middle point
        const boundClient = targetElement.current.getBoundingClientRect();
        const middlePoint = boundClient.height / 2;
        const targetPos = boundClient.top + middlePoint;

        // bounds
        const windowHalf = window.innerHeight / 2;
        const heavenWindow = windowHalf - 50;
        const hellWindow = windowHalf + 50;

        //condition
        if (targetPos > heavenWindow && targetPos < hellWindow) {
          if (targetPos > heavenWindow && targetPos < windowHalf) {
            yPosRef.current = -80;
            api.start({ y: yPosRef.current, scale: yPosRef.current + 40 });
          } else {
            yPosRef.current = 40;
            api.start({ y: yPosRef.current, scale: yPosRef.current });
          }
        }
      } else {
        const middleOffset = 15.5 + 5;
        const targetPos = yPosRef.current + middleOffset + my;
        console.log(targetPos);
        if (targetPos > -40 && targetPos < 40) {
          if (targetPos > -40 && targetPos < 0) {
            yPosRef.current = -80;
            api.start({ y: yPosRef.current, scale: yPosRef.current + 40 });
          } else {
            yPosRef.current = 40;
            api.start({ y: yPosRef.current, scale: yPosRef.current });
          }
        }
      }

      updateSortData({ id: id, yPos: yPosRef.current });
    }

    if (down) {
      if (!wasDragging.current && (my > 5 || my < -5)) {
        wasDragging.current = true;
      }
      const offsetYPos = my + yPosRef.current;
      api.start({
        y: offsetYPos,
        scale:
          offsetYPos > 0
            ? offsetYPos
            : offsetYPos +
              targetElement.current!.getBoundingClientRect().height,
      });
    }

    api.start({ x: down ? mx : 0 });
  });

  useEffect(() => {
    // if()
    // console.log
    // if(pageRe)
    // if (!pageRender) {

    // console.log("hello");
    api.set({
      // from: { y: yPosMemo > 0 ? 25 : -25, scale: yPosMemo > 0 ? 25 : -25 },
      // to: {
      y: yPosMemo,
      scale:
        yPosMemo > 0
          ? yPosMemo
          : yPosMemo + targetElement.current!.getBoundingClientRect().height,
      // },
    });
    // }
  }, []);

  return (
    <animated.div
      className={styles.timePoleMarkerContainer}
      style={{
        opacity: yPos ? "100%" : "0%",
        left: `${xPercent}%`,
        transformOrigin: "center left",
        transform: to(
          [timelineSpring.scale, timelineSpring.markerX],
          (scale) => `scaleX(${1 / scale}) `
        ),
      }}
      onClick={() => {
        if (!wasDragging.current) {
          if (timePoleDataArr.length > 1) {
            setSelectedGroupPole(timePoleDataArr);
          } else {
            setSelectedPole(timePoleDataArr[0]);
          }
        }
        wasDragging.current = false;
      }}
    >
      <animated.div
        className={styles.animatedTimePole}
        style={{
          transform: interpolate([scale], (s: number) => {
            return `scaleY(${s})`;
          }),
          transformOrigin: "top",
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        style={{ x, y, touchAction: "pan-y" }}
        className={styles.textContainer}
        id={`pole-${id}`}
        ref={targetElement}
        onClick={(e) => {
          console.log(e.currentTarget.getBoundingClientRect());
          // console.log(window.innerHeight);
        }}
        data-length={timePoleDataArr.length}
      >
        {timePoleDataArr.map((_pole, index) => {
          return (
            <div className={styles.textBubble} key={index}>
              <p style={{ margin: 0, whiteSpace: "nowrap" }}>{_pole.title}</p>
            </div>
          );
        })}
      </animated.div>
    </animated.div>
  );
}

export function Timepole({ style }: { style?: { backgroundColor?: string } }) {
  return <div className={styles.timepole} style={{ ...style }}></div>;
}
