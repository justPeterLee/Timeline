import styles from "./DisplayTimeline.module.css";
import { useContext, useState } from "react";
import { TimelineSpringContext } from "../Context/TimelineContext";
// import { Timeline } from "../Timeline/Timeline";
import { TimelineCardAnimation } from "../Timeline/Timeline";
// import { TimePoleDisplay } from "../../timepole/Timepole";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";
import { TimePolesTimeline } from "../TimePoles/TimePolesTimeline";
import { Modal } from "../../elements/Links";
import {
  GroupTimePoleSelectionModal,
  TimePoleModal,
} from "../../modals/Modals";

export function DisplayTimeline({
  poles,
  showPoles,
}: {
  poles: StandardPoleData[];
  showPoles: StandardPoleData[];
}) {
  const springContext = useContext(TimelineSpringContext);
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

  return (
    <div className={styles.DisplayTimeline}>
      <TimelineCardAnimation
        timelineSpring={springContext!.timelineSpring}
        id="display-timeline"
      >
        {/* <TimePoleDisplay
          url="year"
          poles={poles}
          timelineSpring={springContext!.setTimelineSpring}
        /> */}
        <TimePolesTimeline
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
          <TimePoleModal
            onClose={onClose}
            timePoleData={selectedPole}
            deleteSortData={() => {}}
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
    </div>
  );
}
