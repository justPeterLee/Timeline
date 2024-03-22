import styles from "./LinkTimeline.module.css";
import { current, monthByIndex } from "../../../tools/data/monthData";

import {
  TimelineCard,
  TimelineCardAnimation,
  TimelineSpringValue,
} from "../Timeline/Timeline";
import { useNavigate, useParams } from "react-router-dom";
// import

export function LinktTimelineYear({
  timelineSpring,
}: {
  timelineSpring: TimelineSpringValue;
}) {
  const navigate = useNavigate();
  const { year } = useParams();

  const months = monthByIndex;

  return (
    <TimelineCardAnimation timelineSpring={timelineSpring} id="year-link">
      <>
        {Array.from({ length: Object.keys(months).length }, (_, index) => {
          const width = (100 / 365) * months[index + 1].days;
          // get year
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
}: {
  style?: {};
  onNavigate: () => void;
}) {
  return (
    <div
      className={styles.LinkSection}
      onClick={onNavigate}
      style={{ ...style }}
    ></div>
  );
}
