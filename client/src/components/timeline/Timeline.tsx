import styles from "./Timeline.module.css";
import { ReactNode } from "react";

// components
import { TimelineSVG } from "./timeline_components/TimelineComponents";

// year page
// import TimelineYearPage from "./TimelineYear/TimelineYear";

// month page
// import TimelineMonthPage from "./TimelineMonth/TimelineMonth";

// other
// import { useParams } from "react-router-dom";

export default function TimelineCard({ children }: { children: ReactNode }) {
  // const { month } = useParams();

  return (
    <div className={styles.container}>
      <TimelineSVG />
      {children}
      {/* 
      {!month || month === "0" ? (
        <>
          <TimelineYearPage />
        </>
      ) : (
        <TimelineMonthPage />
      )} */}
    </div>
  );
}
