import styles from "./TimelineComponents.module.css";
import { current, month_data, getDateFromDayOfYear } from "../../../tools/data";
import { useState } from "react";
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
  const [xPercent, setXPercent] = useState<number>(0);
  const [dayOfYear, setDayOfYear] = useState<Date | null>(null);
  const [selectedDOY, setSelectedDOY] = useState<Date | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

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

      const day = Math.floor((x * 100) / 0.27397260274 + 1);
      if (day >= 1 && day <= 365) {
        setDayOfYear(getDateFromDayOfYear(day, 2024));
      }
    }
  };

  const handleClickMouse = () => {
    setSelectedDOY(() => {
      return dayOfYear;
    });
  };

  return (
    <>
      <div
        className={styles.createTimeline}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          setToggle(() => true);
        }}
        onMouseLeave={() => {
          setToggle(() => false);
        }}
        onClick={() => {
          handleClickMouse();
          // setToggle(() => false);
        }}
      >
        <div
          className={styles.createMarker}
          style={{
            transform: `translate(${xPercent}%, -50%)`,
            opacity: toggle ? "100%" : "0%",
          }}
        ></div>
        {JSON.stringify(dayOfYear)}
        {JSON.stringify(selectedDOY)}
      </div>
      <CreatePoleModal xPercent={xPercent} />
    </>
  );
}

import { Timepole } from "../../timepole/Timepole";
import { ValidInput } from "../../elements/Links";
function CreatePoleModal({ xPercent }: { xPercent: number }) {
  return (
    <div
      className={styles.createTimeline}
      style={{ position: "absolute", zIndex: "-1" }}
    >
      <div
        className={styles.poleModalContainer}
        style={{ transform: `translate(${xPercent}%, -50%)` }}
      >
        {/* <div className={styles.createMarker}></div> */}
        <div className={styles.inputContainer}>
          <ValidInput label="title" />
        </div>
        <Timepole />
      </div>
    </div>
  );
}
