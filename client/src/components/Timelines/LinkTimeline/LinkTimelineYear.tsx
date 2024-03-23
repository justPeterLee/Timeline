import styles from "./LinkTimeline.module.css";
import { current, monthByIndex } from "../../../tools/data/monthData";

import {
  TimelineCardAnimation,
  TimelineSpringValue,
} from "../Timeline/Timeline";

import { useNavigate, useParams } from "react-router-dom";

export function LinktTimelineYear({
  timelineSpring,
}: {
  timelineSpring: TimelineSpringValue;
}) {
  const navigate = useNavigate();
  const { year, month } = useParams();

  const months = monthByIndex;

  return (
    <TimelineCardAnimation timelineSpring={timelineSpring} id="year-link">
      <>
        {Array.from({ length: Object.keys(months).length }, (_, index) => {
          const width = (100 / 365) * months[index + 1].days;
          const parseMonth = month ? parseInt(month) : null;

          const isActive = month
            ? parseMonth === index + 1
              ? true
              : false
            : false;
          const onNavigate = () => {
            navigate(`/month/${year ? year : current.year}/${index + 1}/view`);
          };
          // console.log(width);
          return (
            <LinkSection
              key={index}
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                width: `${width}%`,
              }}
              onNavigate={onNavigate}
              isActive={isActive}
            />
          );
        })}
      </>
    </TimelineCardAnimation>
  );
}

function LinkSection({
  style = {},
  onNavigate,
  isActive,
}: {
  style?: {};
  onNavigate: () => void;
  isActive: boolean;
}) {
  return (
    <div
      className={styles.LinkSection}
      id={isActive ? styles.ActiveLink : styles.InactiveLink}
      onClick={() => {
        console.log(isActive);
        if (!isActive) {
          onNavigate();
        }
      }}
      style={{ ...style }}
    ></div>
  );
}
