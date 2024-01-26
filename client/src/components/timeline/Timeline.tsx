import styles from "./Timeline.module.css";

// components
import {
  TodayTrackerYear,
  TimelineSVG,
} from "./timeline_components/TimelineComponents";

// year page
import TimelineYearPage from "./TimelineYear/TimelineYear";

// month page
import TimelineMonthPage from "./TimelineMonth/TimelineMonth";

// other
import { useAnimationTransition } from "../../tools/hooks/useTransition";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

export default function Timeline() {
  useAnimationTransition();

  const location = useLocation();
  const { month } = useParams();

  const [monthSelected, setMonthSelected] = useState<number>(-1);

  const setSelectedMonth = (index: number) => {
    setMonthSelected(() => index);
  };

  useEffect(() => {
    setSelectedMonth(-1);
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <TimelineSVG />

      {!month || month === "0" ? (
        <>
          <TodayTrackerYear accurate={false} />
          <TimelineYearPage
            selectMonth={setMonthSelected}
            selectedMonth={monthSelected}
          />
        </>
      ) : (
        <TimelineMonthPage />
      )}
    </div>
  );
}
