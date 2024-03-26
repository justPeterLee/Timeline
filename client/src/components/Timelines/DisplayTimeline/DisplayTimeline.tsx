import styles from "./DisplayTimeline.module.css";
import { useContext } from "react";
import { TimelineSpringContext } from "../Context/TimelineContext";
// import { Timeline } from "../Timeline/Timeline";
import { TimelineCardAnimation } from "../Timeline/Timeline";
export function DisplayTimeline() {
  const springContext = useContext(TimelineSpringContext);

  return (
    <div className={styles.DisplayTimeline}>
      <TimelineCardAnimation
        timelineSpring={springContext!.timelineSpring}
        id="display-timeline"
      >
        <></>
      </TimelineCardAnimation>
    </div>
  );
}
