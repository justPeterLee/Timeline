import styles from "./ViewTimeline.module.css";

import { Timeline } from "../Timeline/Timeline";

import { useSpring } from "react-spring";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

import { calcOriginPercent, findScaleRatio } from "./ViewAnimation";
import { monthByIndex } from "../../../tools/data/monthData";
import { LinktTimelineYear } from "../LinkTimeline/LinkTimelineYear";
// import {Dis}

export default function ViewTimeline() {
  const { month } = useParams();

  const location = useLocation();

  const timelineContainer = useRef<null | HTMLDivElement>(null);
  const currentState = useRef(location.pathname);
  const previousState = useRef<null | string>(null);

  const originOffset = useRef(0);
  const isMonthSwitch = useRef(false);

  const [timelineSpring, timelineApi] = useSpring(() => ({
    x: 0,
    scale: month ? 10.8 : 1,
    origin: 0,
    markerX: 0,
    markerDayOpacity: 0,
  }));

  if (currentState.current !== location.pathname) {
    previousState.current = currentState.current;
    currentState.current = location.pathname;
  }

  useEffect(() => {
    if (timelineContainer.current) {
      function selectedMonth(urlMonth: string | undefined) {
        if (urlMonth) {
          const parsedMonth = parseInt(urlMonth);
          if (parsedMonth <= 1) {
            return 1;
          }
          if (parsedMonth >= 12) {
            return 12;
          }
          return parsedMonth;
        }
        return null;
      }

      const monthSelected = selectedMonth(month);

      const scale = monthSelected
        ? findScaleRatio(
            monthByIndex[monthSelected].days,
            timelineContainer.current
          )
        : 1;

      const simplifyOP =
        monthSelected != null
          ? calcOriginPercent(monthSelected, scale, timelineContainer.current)
          : 0;

      if (month) {
        originOffset.current = simplifyOP;
      }
      if (previousState.current) {
        // is transition

        if (monthSelected != null) {
          // transition month
          if (!isMonthSwitch.current) {
            timelineApi.set({ origin: simplifyOP });
            timelineApi.start({ scale: scale, markerDayOpacity: 1 });
            isMonthSwitch.current = true;
          } else {
            timelineApi.start({
              scale: scale,
              origin: simplifyOP,
              markerDayOpacity: 1,
            });
          }
        } else {
          // transition year
          timelineApi.set({
            origin: originOffset.current,
            markerDayOpacity: 0,
          });
          timelineApi.start({ scale: 1, markerDayOpacity: 0 });
          isMonthSwitch.current = false;
        }
      } else {
        // is render
        if (monthSelected != null) {
          timelineApi.set({
            scale: scale,
            origin: simplifyOP,
            markerDayOpacity: 1,
          });
          isMonthSwitch.current = true;
        } else {
          // render year
          timelineApi.set({ scale: 1, origin: 0, markerDayOpacity: 0 });
          isMonthSwitch.current = false;
        }
      }
    }
  }, [timelineContainer, location]);
  return (
    <div
      className={styles.ViewTimelineContainer}
      id={"view-timeline-container"}
      ref={timelineContainer}
    >
      <Timeline timelineSpring={timelineSpring}></Timeline>
      <LinktTimelineYear timelineSpring={timelineSpring} />
      {/* <DisplayTimeline timelineSpring={timelineSpring} /> */}
      {/* <div
        className={styles.OriginMarker}
        style={{ transform: "translateX(5%)" }}
      >
        <div
          style={{ height: "10px", width: "1px", backgroundColor: "black" }}
        ></div>
      </div> */}
    </div>
  );
}
