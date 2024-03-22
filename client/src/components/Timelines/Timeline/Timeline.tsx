import { ReactNode } from "react";
import styles from "./Timeline.module.css";
import { SpringValues, animated, to } from "react-spring";

export function TimelineCard({
  children,
  id = "timeline",
  style = {},
}: {
  children: ReactNode;
  id: string;
  style: {};
}) {
  return (
    <div className={styles.TimelineCard} id={id} style={{ ...style }}>
      {children}
    </div>
  );
}

type TimelineSpringVlaue = SpringValues<{
  x: number;
  scale: number;
  origin: number;
  markerX: number;
  markerDayOpacity: number;
}>;

export function TimelineCardAnimation({
  timelineSpring,
  id,
  children,
}: {
  timelineSpring: TimelineSpringVlaue;
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
