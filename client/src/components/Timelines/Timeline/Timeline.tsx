import { ReactNode } from "react";
import styles from "./Timeline.module.css";
import { SpringValues, animated, to } from "react-spring";
import { MarkerAllContainer } from "./Marker";

export type TimelineSpringValue = SpringValues<{
  x: number;
  scale: number;
  origin: number;
  markerX: number;
  markerDayOpacity: number;
}>;

export function TimelineCard({
  children,
  id = "timeline",
  style = {},
}: {
  children: ReactNode;
  id: string;
  style?: {};
}) {
  return (
    <div className={styles.TimelineCard} id={id} style={{ ...style }}>
      {children}
    </div>
  );
}

export function TimelineCardAnimation({
  timelineSpring,
  id,
  children,
}: {
  timelineSpring: TimelineSpringValue;
  id: string;
  children: ReactNode;
}) {
  return (
    <animated.div
      className={styles.Timeline}
      id={id}
      style={{
        transformOrigin: timelineSpring.origin.to((value) => `${value}%`),
        transform: to(
          [timelineSpring.scale, timelineSpring.x],
          (scale, x) => `scaleX(${scale}) translate(${x}px,-50%)`
        ),
      }}
    >
      {children}
    </animated.div>
  );
}

export function Timeline({
  timelineSpring,
}: {
  timelineSpring: TimelineSpringValue;
}) {
  return (
    <TimelineCardAnimation timelineSpring={timelineSpring} id={"timeline"}>
      <div className={styles.TimelineCover}></div>
      <MarkerAllContainer timelineSpring={timelineSpring} />
    </TimelineCardAnimation>
  );
}
