import styles from "./DisplayTimeline.module.css";
import { useContext } from "react";
import { TimelineSpringContext } from "../Context/TimelineContext";
// import { Timeline } from "../Timeline/Timeline";
import { TimelineCardAnimation } from "../Timeline/Timeline";
import { TimePoleDisplay } from "../../timepole/Timepole";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";
export function DisplayTimeline({ poles }: { poles: StandardPoleData[] }) {
  const springContext = useContext(TimelineSpringContext);

  return (
    <div className={styles.DisplayTimeline}>
      <TimelineCardAnimation
        timelineSpring={springContext!.timelineSpring}
        id="display-timeline"
      >
        <TimePoleDisplay url="year" poles={poles} />
      </TimelineCardAnimation>
    </div>
  );
}
