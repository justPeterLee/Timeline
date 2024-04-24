import styles from "./DisplayTimeline.module.css";

import { animated, to } from "react-spring";

import { useContext, useMemo, useState } from "react";

import { TimelineSpringContext } from "../Context/TimelineContext";

import {
  StandardPoleData,
  getPoleDataList,
} from "../../../tools/utilities/timepoleUtils/timepoleUtils";

import {
  TimelineCardAnimation,
  TimelineSpringValue,
} from "../Timeline/Timeline";
import { TimePolesTimeline } from "../TimePoles/TimePolesTimeline";
// @ts-ignore
import { Modal } from "../../modals/ModalComponents";
import { GroupTimePoleSelectionModal, TimePoleModal } from "../../modals/MMM";

import { extractPoleData } from "../../../tools/utilities/timepoleUtils/timepole";

export function DisplayTimeline({
  timelineId,
  poles,
  showPoles,
  sortData,
}: {
  timelineId: string;
  poles: StandardPoleData[];
  showPoles: StandardPoleData[];
  sortData: {};
}) {
  const springContext = useContext(TimelineSpringContext);
  const [selectedPole, setSelectedPole] = useState<null | StandardPoleData>(
    null
  );
  const [selectedGroupPole, setSelectedGroupPole] = useState<
    null | StandardPoleData[]
  >(null);
  const onOpenSelectedPole = (_pole: StandardPoleData) => {
    setSelectedPole(_pole);
  };
  const onClose = () => {
    setSelectedPole(null);
    setSelectedGroupPole(null);
  };
  const onOpenSelectedGroupPole = (_pole: StandardPoleData[]) => {
    setSelectedGroupPole(_pole);
  };

  return (
    <div className={styles.DisplayTimeline}>
      <TimelineCardAnimation
        timelineSpring={springContext!.timelineSpring}
        id="display-timeline"
      >
        <TimePolesTimeline
          timelineId={timelineId}
          sortData={sortData}
          poles={poles}
          showPoles={showPoles}
          func={{
            onOpenSelectedPole: onOpenSelectedPole,
            onOpenSelectedGroupPole: onOpenSelectedGroupPole,
          }}
        />
      </TimelineCardAnimation>

      {selectedPole && (
        <Modal onClose={onClose} styles={{ minWidth: "20rem" }}>
          <TimePoleModal onClose={onClose} timePoleData={selectedPole} />
        </Modal>
      )}

      {selectedGroupPole && (
        <GroupTimePoleSelectionModal
          timePoleDataArr={selectedGroupPole}
          setSelectedPole={onOpenSelectedPole}
          onClose={onClose}
        />
      )}
    </div>
  );
}

export function CreateDisplayTimeline({
  poles,
  timelineSpring,
}: {
  poles: StandardPoleData[];
  timelineSpring: TimelineSpringValue;
}) {
  const poleData = useMemo(() => {
    const polesData = getPoleDataList(poles, "year");
    return polesData;
  }, [poles]);

  const extractedPoleDatas = useMemo(() => {
    return extractPoleData(poleData);
  }, [poleData]);

  return (
    <TimelineCardAnimation
      timelineSpring={timelineSpring}
      id="dot-pole-timeline"
    >
      {Object.keys(extractedPoleDatas).map((_poleKey) => {
        const _pole = extractedPoleDatas[_poleKey];
        const key = Math.random();

        return (
          <DotPole key={key} poleData={_pole} timelineSpring={timelineSpring} />
        );
      })}
    </TimelineCardAnimation>
  );
}

function DotPole({
  poleData,
  timelineSpring,
}: {
  poleData: {
    id: string;
    poles: StandardPoleData[];
    xPercent: number;
  };

  timelineSpring: TimelineSpringValue;
}) {
  return (
    <animated.div
      className={styles.DotPole}
      style={{
        left: `${poleData.xPercent}%`,
        transformOrigin: "left center",
        transform: to(
          [timelineSpring.scale, timelineSpring.x],
          (scale) => `scaleX(${1 / scale}) translateX(-2px)`
        ),
      }}
    ></animated.div>
  );
}
