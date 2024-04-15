import styles from "./TimePolesTimeline.module.css";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  StandardPoleData,
  generatePoleKey,
} from "../../../tools/utilities/timepoleUtils/timepoleUtils";
import { getPoleDataList } from "../../../tools/data";
import {
  compareSortPoles,
  extractPoleData,
  sort,
  sortDataUpdater,
} from "../../../tools/utilities/timepoleUtils/timepole";
import { animated, to } from "react-spring";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/redux-hooks/redux.hook";

export function TimePolesTimeline({
  timelineId,
  sortData,
  poles,
  showPoles,
  func,
}: //   showPoles,
{
  timelineId: string;
  sortData: {};
  poles: StandardPoleData[];
  showPoles: StandardPoleData[];
  func: {
    onOpenSelectedPole: (_pole: StandardPoleData) => void;
    onOpenSelectedGroupPole: (_pole: StandardPoleData[]) => void;
  };
  //   showPoles: StandardPoleData[];
}) {
  const user = useAppSelector((store) => store.userAccount);
  const dispatch = useAppDispatch();
  const poleData = useMemo(() => {
    const polesData = getPoleDataList(poles, "year");
    return polesData;
  }, [poles]);

  const extractedPoleDatas = useMemo(() => {
    return extractPoleData(poleData);
  }, [poleData]);

  const showPoleData = useMemo(() => {
    const extractShowData = extractPoleData(getPoleDataList(showPoles, "year"));

    const extractShowDatakey = Object.keys(extractShowData);
    const showDataKey: { [key: string]: any } = {};

    for (let i = 0; i < extractShowDatakey.length; i++) {
      const generateShowDataKey = generatePoleKey(extractShowDatakey[i]);
      showDataKey[generateShowDataKey] = true;
    }
    return showDataKey;
  }, [showPoles]);

  const localSortData = window.localStorage.getItem("localSortData");

  const [localState, setLocalState] = useState(localSortData);

  const debounceFunctionCall = useMemo(() => {
    return debounceFunction((args: any) => {
      console.log(args);
    }, 2000);
  }, []);

  const onMovedPole = (_pole: { id: string; yPos: number }) => {
    // create copy of local sort data
    const localSortProxy = localState ? JSON.parse(localState) : {};

    // update moved pole position
    localSortProxy[_pole.id] = { yPos: _pole.yPos };
    const jsonSortData = JSON.stringify(localSortProxy);

    // update local sort data
    window.localStorage.setItem("localSortData", jsonSortData);

    if (user.id) {
      // console.log()
      debounceFunctionCall("test");
    }

    // rerender page
    setLocalState(jsonSortData);
  };

  useEffect(() => {
    if (user.id) {
      // copy of sort data (cannot mutate sort data)
      const sortDataCopy = { ...sortData };

      // check if sort data is up to date (auto generate s-data for poles without s-data)
      const editSortData = compareSortPoles(poles, sortDataCopy);

      if (editSortData.addArray.length || editSortData.deleteArray.length) {
        const updatedSortData = sortDataUpdater(
          editSortData,
          sortDataCopy,
          poles,
          "year"
        );

        // req to update sort data
        dispatch({
          type: "UPDATE_SORTDATA_SERVER",
          payload: { timelineId: timelineId, sortData: updatedSortData },
        });
      }

      window.localStorage.setItem(
        "localSortData",
        JSON.stringify(sortDataCopy)
      );

      setLocalState(JSON.stringify(sortDataCopy));
    } else {
      if (!localSortData) {
        // generate local storage if sort data not initiated

        const newSortData = sort(poleData);
        const jsonSortData = JSON.stringify(newSortData);

        window.localStorage.setItem("localSortData", jsonSortData);
        const localSortDatas = window.localStorage.getItem("localSortData");

        setLocalState(localSortDatas);
      }

      // update sort data
      if (localSortData) {
        const jsonLocalSortData = JSON.parse(localSortData);

        const editSortData = compareSortPoles(poles, jsonLocalSortData);
        if (editSortData.addArray.length || editSortData.deleteArray.length) {
          const updatedSortData = sortDataUpdater(
            editSortData,
            jsonLocalSortData,
            poles,
            "year"
          );

          window.localStorage.setItem("localSortData", updatedSortData);

          const utdLocalSortData = window.localStorage.getItem("localSortData");
          setLocalState(utdLocalSortData);
        }
      }
    }
  }, [poleData]);
  return (
    <>
      {Object.keys(extractedPoleDatas).map((_poleKey) => {
        const _pole = extractedPoleDatas[_poleKey];
        const genPoleKey = generatePoleKey(_poleKey);
        const parseLocalState = localState
          ? JSON.parse(localState)[genPoleKey]
          : null;

        const isShowing = showPoleData[genPoleKey] ? true : false;
        return (
          <TimePole
            key={_poleKey}
            id={genPoleKey}
            poleData={_pole}
            yPos={parseLocalState}
            isShowing={isShowing}
            setSelectedPole={func.onOpenSelectedPole}
            setSelectedGroupPole={func.onOpenSelectedGroupPole}
            onMovedPole={onMovedPole}
          />
        );
      })}
    </>
  );
}

import { useDrag } from "@use-gesture/react";
import { useSpring } from "react-spring";
import { TimelineSpringContext } from "../Context/TimelineContext";
import { debounceFunction } from "../../../tools/utilities/utilities";

function TimePole({
  id,
  poleData,
  yPos,
  isShowing,

  setSelectedPole,
  setSelectedGroupPole,

  onMovedPole,
}: {
  id: string;
  poleData: {
    id: string;
    poles: StandardPoleData[];
    xPercent: number;
  };
  yPos: { yPos: number } | null | undefined;
  isShowing: boolean;

  setSelectedPole: (_pole: StandardPoleData) => void;
  setSelectedGroupPole: (_pole: StandardPoleData[]) => void;

  onMovedPole: (_pole: { id: string; yPos: number }) => void;
}) {
  const timelineSpring = useContext(TimelineSpringContext);

  const textBubbleTarget = useRef<null | HTMLDivElement>(null);
  const yPosRef = useRef(yPos ? yPos.yPos : 0);

  const wasDragging = useRef(false);
  // const reRenderRef = useRef(0);

  const [timePoleSpring, timePoleApi] = useSpring(() => ({
    x: 0,
    y: yPosRef.current,
    scale: yPosRef.current,
    opacity: 0,
  }));

  const bind = useDrag(({ down, movement: [mx, _my] }) => {
    if (textBubbleTarget.current) {
      // console.log(moving);
      const halfHeight =
        textBubbleTarget.current.getBoundingClientRect().height / 2;

      if (!down) {
        yPosRef.current = _my + yPosRef.current;
        timePoleApi.start({ x: 0 });

        //middle point
        const boundClient = textBubbleTarget.current.getBoundingClientRect();
        const middlePoint = boundClient.height / 2;
        const targetPos = boundClient.top + middlePoint;

        // bounds
        const windowHalf = window.innerHeight / 2;
        const heavenWindow = windowHalf - 50;
        const hellWindow = windowHalf + 50;

        //condition
        if (targetPos > heavenWindow && targetPos < hellWindow) {
          if (targetPos > heavenWindow && targetPos < windowHalf) {
            yPosRef.current = -40;
            timePoleApi.start({
              y: yPosRef.current,
              scale: yPosRef.current + halfHeight + 5,
            });
          } else {
            yPosRef.current = 40;
            timePoleApi.start({
              y: yPosRef.current,
              scale: yPosRef.current - halfHeight - 5,
            });
          }
        }
        onMovedPole({ id: id, yPos: yPosRef.current });
        // timePoleApi.start({
        //   y: yPosRef.current,
        //   // onResolve: () => {
        //   //   onMovedPole({ id: id, yPos: yPosRef.current });
        //   // },
        // });
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
          // onResolve: () => {
          //   onMovedPole({ id: id, yPos: yPosRef.current });
          // },
        });

        // if()
      }
    }
  });

  useEffect(() => {
    // if (!yPosRef.current) {
    let scale = 0;
    if (yPos && textBubbleTarget.current) {
      const halfHeight =
        textBubbleTarget.current.getBoundingClientRect().height / 2;
      scale =
        yPos.yPos <= 0
          ? yPos.yPos + halfHeight + 5
          : yPos.yPos - halfHeight - 5;
    }
    timePoleApi.start({
      y: yPos ? yPos.yPos : 0,
      scale: scale,
    });

    yPosRef.current = yPos ? yPos.yPos : 0;
  }, [yPos]);

  useEffect(() => {
    timePoleApi.start({ opacity: isShowing ? 1 : 0 });
  }, [isShowing]);

  return (
    <animated.div
      className={styles.TimePole}
      style={{
        left: `${poleData.xPercent}%`,
        opacity: timePoleSpring.opacity,
        transformOrigin: "left center",
        transform: to(
          [timelineSpring!.timelineSpring.scale],
          (scale) => `scaleX(${1 / scale})`
        ),
      }}
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
        data-length={poleData.poles.length}
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
