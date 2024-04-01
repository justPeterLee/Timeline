import styles from "./ViewTimeline.module.css";

import { Timeline } from "../Timeline/Timeline";

import { useLocation } from "react-router-dom";
import { useEffect, useRef, useContext } from "react";

import { LinktTimelineYear } from "../LinkTimeline/LinkTimelineYear";
import { TimelineSpringContext } from "../Context/TimelineContext";

export default function ViewTimeline() {
  const timelineSpringContext = useContext(TimelineSpringContext);
  const location = useLocation();
  const timelineContainer = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (timelineContainer.current) {
      timelineSpringContext!.calculateOP(timelineContainer.current);
    }
  }, [timelineContainer, location]);
  return (
    <div
      className={styles.ViewTimelineContainer}
      id={"view-timeline-container"}
      ref={timelineContainer}
    >
      <Timeline
        timelineSpring={timelineSpringContext!.timelineSpring}
      ></Timeline>
      <LinktTimelineYear
        timelineSpring={timelineSpringContext!.timelineSpring}
      />
    </div>
  );
}
