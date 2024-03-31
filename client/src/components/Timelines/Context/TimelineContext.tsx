import { ReactNode, createContext, useRef } from "react";
import { useSpring } from "react-spring";
import { useLocation, useParams } from "react-router-dom";

import { TimelineSpringValue } from "../Timeline/Timeline";
import { current, monthByIndex } from "../../../tools/data/monthData";
import {
  calcOriginPercent,
  findScaleRatio,
} from "../ViewTimeline/ViewAnimation";

export const TimelineSpringContext = createContext<null | {
  setTimelineSpring: TimelineSpringValue;
  timelineSpring: TimelineSpringValue;
  calculateOP: (params: HTMLDivElement) => void;
}>(null);

export function TimeSpringContext({ children }: { children: ReactNode }) {
  const { month } = useParams();
  const location = useLocation();

  const currentState = useRef(location.pathname);
  const previousState = useRef<null | string>(null);

  const originOffset = useRef(0);
  const isMonthSwitch = useRef(false);

  const [timelineSpring, timelineApi] = useSpring(() => ({
    opacity: 1,
    x: 0,
    scale: month ? 10.8 : 1,
    origin: 0,
    markerX: 0,
    markerDayOpacity: 0,
  }));

  const [setTimelineSpring, setTimelineApi] = useSpring(() => ({
    opacity: 0,
    x: 0,
    scale: month ? 10.8 : 1,
    origin: 0,
    markerX: 0,
    markerDayOpacity: 0,
  }));

  function normalizeMonth() {
    if (month) {
      const parseMonth = parseInt(month);
      if (!isNaN(parseMonth)) {
        if (parseMonth <= 1) {
          return 1;
        }
        if (parseMonth >= 12) {
          return 12;
        }

        return parseMonth;
      } else {
        return current.today.month + 1;
      }
    } else {
      return null;
    }
  }

  function updateUrlState() {
    if (currentState.current !== location.pathname) {
      previousState.current = currentState.current;
      currentState.current = location.pathname;
    }
  }

  function calculateOP(timelineContainer: HTMLDivElement) {
    updateUrlState();

    const normalMonth = normalizeMonth();

    const scale = normalMonth
      ? findScaleRatio(monthByIndex[normalMonth].days, timelineContainer)
      : 1;

    const op = normalMonth
      ? calcOriginPercent(normalMonth, scale, timelineContainer)
      : 0;

    if (normalMonth) {
      originOffset.current = op;
    }

    if (previousState.current) {
      // transition
      // console.log("trans");

      if (normalMonth) {
        //month

        if (!isMonthSwitch.current) {
          timelineApi.set({ origin: op });
          timelineApi.start({ scale: scale });

          isMonthSwitch.current = true;
        } else {
          timelineApi.start({
            scale: scale,
            origin: op,
          });
        }
        setTimelineApi.set({ origin: op, scale: scale });
      } else {
        // year

        timelineApi.set({ origin: originOffset.current });
        timelineApi.start({ scale: 1 });
        isMonthSwitch.current = false;

        setTimelineApi.set({ origin: originOffset.current, scale: 1 });
      }
    } else {
      // render
      // console.log("render");

      if (normalMonth != null) {
        //month

        // console.log("render month");
        timelineApi.set({ scale: scale, origin: op });
        timelineApi.start({ opacity: 1 });

        isMonthSwitch.current = true;

        setTimelineApi.set({ opacity: 1, origin: op, scale: scale });
      } else {
        // year

        // console.log("render year", normalMonth);
        timelineApi.set({ scale: 1, origin: 0, opacity: 1 });
        isMonthSwitch.current = false;

        setTimelineApi.set({ opacity: 1, origin: 0, scale: 1 });
      }
    }
  }

  return (
    <TimelineSpringContext.Provider
      value={{
        setTimelineSpring: setTimelineSpring,
        timelineSpring: timelineSpring,
        calculateOP: calculateOP,
      }}
    >
      {children}
    </TimelineSpringContext.Provider>
  );
}
