import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef, useState, useMemo } from "react";
import { getPoleDataList } from "../../tools/data";
import {
  sort,
  insertSorData,
  compareSortPoles,
} from "../../tools/utilities/timepoleUtils/timepole";

import {
  PoleCordsData,
  PoleData,
  StandardPoleData,
} from "../../tools/utilities/timepoleUtils/timepoleUtils";

export function TimePoleDisplay({
  url,
  poles,
}: {
  url: string | undefined;
  poles: any[];
}) {
  const urlView = url ? url : "year";

  const poleDatas: PoleData = useMemo(() => {
    return getPoleDataList(poles, urlView);
  }, [poles, urlView]);

  const [sortData, setSortData] = useState<any>({});
  const [pageRender, setPageRender] = useState(false);

  const [selectedPole, setSelectedPole] = useState<null | StandardPoleData>(
    null
  );

  const onClose = () => {
    setSelectedPole(null);
  };

  const updateWindowSort = (data: string) => {
    window.localStorage.setItem("sortDataEffect", data);
  };

  const updateSortData = (_pole: { id: string; yPos: number }) => {
    const proxyLocalData = sortData;
    proxyLocalData[_pole.id] = { yPos: _pole.yPos };

    const jsonSortData = JSON.stringify(proxyLocalData);
    updateWindowSort(jsonSortData);
  };

  useEffect(() => {
    //check if sort data already exist
    const localStorageData = window.localStorage.getItem("sortDataEffect");
    if (localStorageData && localStorageData !== undefined) {
      const jsonLocalStorageData: PoleCordsData = JSON.parse(localStorageData);
      const addPoles = compareSortPoles(poles, jsonLocalStorageData);

      if (addPoles.length) {
        console.log(addPoles);
        const newSortData = insertSorData(
          poles,
          addPoles,
          jsonLocalStorageData
        );
        const jsonSortData = JSON.stringify(newSortData);
        updateWindowSort(jsonSortData);
      }
      setSortData(jsonLocalStorageData);
    } else {
      // create sort data
      // check if data is generated
      if (!Object.keys(poleDatas).length) {
        // console.log("invalid poles data: ", poles);
        return;
      }

      // if data is done generated
      const newSortData = sort(poleDatas);
      const jsonSortData = JSON.stringify(newSortData);
      updateWindowSort(jsonSortData);
      setSortData(JSON.parse(window.localStorage.getItem("sortDataEffect")!));
    }
  }, [poles, poleDatas, window.localStorage.getItem("sortDataEffect")]);

  useEffect(() => {
    setPageRender(true);
  }, []);

  return (
    <>
      <div className={styles.timePoleDisplayContainer} id={"asdf"}>
        {Object.keys(poleDatas).map((_week, index) => {
          return (
            <Fragment key={index}>
              {Object.keys(poleDatas[_week].polesList).map((_poleKey) => {
                const _pole = poleDatas[_week].polesList[_poleKey];
                return (
                  <TimepoleMarker
                    key={_pole.id}
                    id={_pole.id}
                    xPercent={_pole.xPercent}
                    timePoleData={_pole.poles}
                    yPos={sortData[_pole.id]}
                    setSelectedPole={(id) => {
                      setSelectedPole(id);
                    }}
                    updateSortData={(_pole: { id: string; yPos: number }) => {
                      updateSortData(_pole);
                    }}
                    pageRender={pageRender}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>
      {selectedPole && (
        <Modal onClose={onClose} styles={{ minWidth: "20rem" }}>
          <TimePoleModal onClose={onClose} timePoleData={selectedPole} />
        </Modal>
      )}
    </>
  );
}

import { useSpring, animated, to as interpolate } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
import { TimePoleModal } from "../modals/modals";
export function TimepoleMarker({
  id,
  xPercent,
  timePoleData,
  yPos,
  pageRender,

  setSelectedPole,
  updateSortData,
}: {
  id: string;
  xPercent: number;
  timePoleData: StandardPoleData[];
  yPos: { yPos: number };
  pageRender: boolean;

  setSelectedPole: (id: StandardPoleData) => void;
  updateSortData: (_pole: { id: string; yPos: number }) => void;
}) {
  const wasDragging = useRef(false);
  const yPosRef = useRef(yPos ? yPos.yPos : 100);
  const targetElement = useRef<HTMLDivElement>(null);

  const yPosMemo = useMemo(() => {
    yPosRef.current = yPos ? yPos.yPos : -100;
    return yPos ? yPos.yPos : -100;
  }, [yPos]);

  const [{ x, y, scale }, api] = useSpring(() => ({
    y: 0,
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
    api.start({
      from: { y: yPosMemo > 0 ? 25 : -25, scale: yPosMemo > 0 ? 25 : -25 },
      to: {
        y: yPosMemo,
        scale:
          yPosMemo > 0
            ? yPosMemo
            : yPosMemo + targetElement.current!.getBoundingClientRect().height,
      },
    });
  }, [pageRender, yPosMemo]);

  // useEffect(() => {
  //   console.log(pageRender);
  //   if (pageRender) {
  //     api.start({
  //       from: { y: yPosMemo > 0 ? 25 : -25, scale: yPosMemo > 0 ? 25 : -25 },
  //       to: { y: yPosMemo, scale: yPosMemo > 0 ? yPosMemo : yPosMemo + 40 },
  //     });
  //   }
  // }, [yPosMemo, pageRender]);
  // if (!yPos) return <></>;

  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
      onClick={() => {
        if (!wasDragging.current) {
          setSelectedPole(timePoleData[0]);
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
      >
        {timePoleData.map((_pole) => {
          return (
            <div className={styles.textBubble} key={_pole.id}>
              <p style={{ margin: 0, whiteSpace: "nowrap" }}>{_pole.title}</p>
            </div>
          );
        })}
      </animated.div>
    </div>
  );
}

export function Timepole({ style }: { style?: { backgroundColor?: string } }) {
  return <div className={styles.timepole} style={{ ...style }}></div>;
}
