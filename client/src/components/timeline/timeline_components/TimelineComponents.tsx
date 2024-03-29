import styles from "./TimelineComponents.module.css";
import { current, month_data, getDateFromDayOfYear } from "../../../tools/data";
import { useState } from "react";
import { Backdrop } from "../../elements/Links";
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
        style={{
          stroke: "rgb(150,150,150)",
          strokeWidth: "2",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </svg>
  );
}

import { format } from "date-fns";
import { CreatePoleModal } from "../../modals/Modals";
import { useNavigate } from "react-router-dom";
type MonthDataSection = {
  month: string;
  day: number;
  weeks: number;
  startDay: number;
  index: number;
};
export function CreateTimeline({
  monthData,
}: {
  monthData?: MonthDataSection;
}) {
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

      const dayConstant = monthData ? 100 / monthData.day : 0.27397260274;
      const day = Math.floor((x * 100) / dayConstant + 1);

      const limit = monthData ? monthData.day : 365;

      if (day >= 1 && day <= limit) {
        monthData
          ? setDayOfYear(new Date(`2024-${monthData.index}-${day}`))
          : setDayOfYear(getDateFromDayOfYear(day, 2024));
      }
    }
  };

  const handleClickMouse = () => {
    setSelectedDOY(dayOfYear);
  };

  const onClose = () => {
    setSelectedDOY(null);
  };

  return (
    <>
      {selectedDOY && <Backdrop onClose={onClose} />}
      <div
        className={styles.createTimeline}
        onMouseMove={(e) => {
          if (!selectedDOY) handleMouseMove(e);
        }}
        onMouseEnter={() => {
          setToggle(() => true);
        }}
        onMouseLeave={() => {
          setToggle(() => false);
        }}
        onClick={handleClickMouse}
        style={{ width: monthData ? "90%" : "" }}
      >
        <div
          className={styles.createMarker}
          style={{
            transform: `translate(${xPercent}%, -50%)`,
            opacity: toggle || selectedDOY ? "100%" : "0%",
          }}
        ></div>
        <div>{dayOfYear && format(dayOfYear, "LLLL d")}</div>

        {selectedDOY && (
          <CreatePoleModal
            xPercent={xPercent}
            date={selectedDOY}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
}

export function WeekMarkers() {
  return (
    <div className={styles.weekMarkersContainer}>
      <>
        {Array.from({ length: 52 }, (_, index) => {
          return <MiniMarkers key={index} index={index} />;
        })}
      </>
    </div>
  );
}

function MiniMarkers({ index }: { index: number }) {
  return (
    <div
      className={styles.weekLine}
      // key={index}
      id={`${index}`}
      style={{
        display: index === 0 ? "none" : "initial",
        left: `${index * 1.92307692308}%`,
      }}
    ></div>
  );
}

export function LinkSection({
  url,
  style,
}: {
  url: string;
  style: { height: string; width: string; left?: string; right?: string };
}) {
  const navigate = useNavigate();
  const onClickEvent = () => {
    console.log("adf");
    navigate(url);
  };
  return (
    <div
      className={styles.linkSection}
      style={style}
      onClick={onClickEvent}
    ></div>
  );
}

// export function MainView({children, style} : {children:ReactNode, style:{width:string, height?:string}}){
//   return (<div>

//   </div>)
// }
