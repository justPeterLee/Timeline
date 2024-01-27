import styles from "./TimelineComponents.module.css";
import { current, month_data } from "../../../tools/data";
import { useRef, useState } from "react";
// identifies todays date (on YEAR timeline)
export function TodayTrackerYear({ accurate }: { accurate: boolean }) {
  const days = month_data[current.today.month];
  const dayPercent = (100 / days.day) * (current.today.date.getDate() - 1);
  return (
    <div
      className={styles.todayContainer}
      style={{
        left: accurate ? `${dayPercent}%` : `${current.today.percent}%`,
      }}
    >
      <div className={styles.today}></div>
      <span className={styles.todayDate}>
        <p>{current.today.date_format}</p>
      </span>
    </div>
  );
}

export function TimelineSVG() {
  return (
    <svg className={styles.timelineSVG}>
      <line
        x1="0"
        y1="50%"
        x2="100%"
        y2="50%"
        style={{ stroke: "rgb(150,150,150)", strokeWidth: "2" }}
      />
    </svg>
  );
}

export function CreateTimeline() {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const [xPercent, setXPercent] = useState<number>(0);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const parentWidth = event.currentTarget.clientWidth;
    const childWidth = event.currentTarget.children[0].clientWidth;
    const { left } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / parentWidth;

    const percent = (parentWidth / childWidth) * (x * 100) + -50;
    const limitPercent = (parentWidth / childWidth) * 100 + -50;
    if (percent <= limitPercent && percent >= -50) {
      setXPercent(() => percent);
    }
  };

  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <div
      ref={parentRef}
      className={styles.createTimeline}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setToggle(() => true);
      }}
      onMouseLeave={() => {
        setToggle(() => false);
      }}
    >
      <div
        ref={childRef}
        className={styles.createMarker}
        style={{
          transform: `translate(${xPercent}%, -50%)`,
          opacity: toggle ? "100%" : "0%",
        }}
      ></div>
    </div>
  );
}
