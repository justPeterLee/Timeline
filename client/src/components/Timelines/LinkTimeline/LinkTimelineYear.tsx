import styles from "./LinkTimeline.module.css";
import { monthByIndex } from "../../../tools/data/monthData";

import { TimelineCard } from "../Timeline/Timeline";
import { useNavigate } from "react-router-dom";
// import

export function LinktTimelineYear() {
  const navigate = useNavigate();
  const months = monthByIndex;

  return (
    <TimelineCard id="year-link">
      <>
        {Array.from({ length: Object.keys(months).length }, (_, index) => {
          const width = (100 / 365) * months[index + 1].days;
          const onNavigate = () => {
            navigate(`/month/${index + 1}`);
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
    </TimelineCard>
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
