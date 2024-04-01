import styles from "./CreateTimeline.module.css";
import { animated, useSpring, to, SpringValues } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useRef, useState } from "react";
import { Timeline } from "../Timeline/Timeline";
import { CreateTimelineModal, DatePickerModal } from "./CreateTimelineModal";
import { useParams } from "react-router-dom";
import { percentToDate } from "../../../tools/utilities/dateFunction";
import { format } from "date-fns";

export function CreateTimeline() {
  const { month, year } = useParams();

  const [createDate, setCreateDate] = useState<null | Date>(null);

  const [hoverDate, setHoverDate] = useState(new Date());
  const hoverDateRef = useRef(new Date());

  const closeModal = () => {
    setCreateDate(null);
    isStopped.current = false;

    // reset timeline state
    timelineBoundaries.current = { left: -10000, right: 10000 };
    timelineDeltaRef.current = 0;
    timelineMovementRef.current = 0;

    // reset timeline animation
    // timelineApi.set({ origin: percentValueRef.current });

    timelineApi.start({ scale: 1, x: 0 });

    // reset dot animation
    dotApi.start({ tetherOpacity: 0, opacity: 0, scale: 1 });
  };

  const timelineContainer = useRef<null | HTMLDivElement>(null);
  const scale = 10;
  const percentValueRef = useRef(0);

  const timelineStepperRef = useRef<number | null>(null);
  const timelineBoundaries = useRef({ left: -10000, right: 10000 });
  const timelineDeltaRef = useRef(0);
  const timelinePercentMovementRef = useRef(0);
  const timelineMovementRef = useRef(0);

  const isStopped = useRef(false);

  const timelineStep = (event: PointerEvent) => {
    const percent = percentToDate(event, year);

    const dateModal = document.getElementById("date-picker-modal");

    if (
      percent.getFullYear() === hoverDateRef.current.getFullYear() &&
      percent.getMonth() === hoverDateRef.current.getMonth() &&
      percent.getDate() === hoverDateRef.current.getDate()
    ) {
    } else {
      hoverDateRef.current = percent;
      if (dateModal) {
        const newDate = format(hoverDateRef.current, "iiii, LLLL d");
        (dateModal as HTMLInputElement).value = newDate;
      }
    }

    // boundaries
    const bound = timelineBoundaries.current;

    // next frame
    const newTranslate =
      (timelineMovementRef.current + timelinePercentMovementRef.current) /
      (scale / 2);

    // check if next frame is within boundaries
    if (newTranslate < bound.left && newTranslate > bound.right) {
      timelineMovementRef.current += timelinePercentMovementRef.current;
    } else {
      timelineMovementRef.current =
        newTranslate > 0 ? bound.left * (scale / 2) : bound.right * (scale / 2);
    }

    // update element (action)
    percentValueRef.current = timelineMovementRef.current;
    timelineApi.set({
      x: timelineMovementRef.current / (scale / 2),
    });

    // recalls stepper
    timelineStepperRef.current = requestAnimationFrame(() => {
      timelineStep(event);
    });
  };

  const [timelineSpring, timelineApi] = useSpring(() => ({
    opacity: 1,
    scale: 1,
    x: 0,
    origin: 0,
    markerX: 0,
    markerDayOpacity: 1,
  }));

  const [dotSpring, dotApi] = useSpring(() => ({
    scale: 1,
    x: 0,
    opacity: 0,
    tetherOpacity: 0,
  }));

  const bind = useGesture({
    onMove: ({ xy, delta, event }) => {
      // calculate percent
      if (timelineContainer.current && !isStopped.current) {
        // setHoverDate(percentToDate(event, year));

        const BCR = timelineContainer.current.getBoundingClientRect();
        const percent =
          ((xy[0] - Math.floor(BCR.x)) / Math.floor(BCR.width)) * 100;
        percentValueRef.current = percent;

        // movement (reset on mouse out)
        timelineDeltaRef.current += delta[0];

        // tether scale
        dotApi.start({ scale: timelineDeltaRef.current });

        // movement buffer
        if (timelineDeltaRef.current < 20 && timelineDeltaRef.current > -20) {
          timelinePercentMovementRef.current = 0;
        } else {
          timelinePercentMovementRef.current =
            (timelineDeltaRef.current / Math.floor(BCR.width) / 150) *
            Math.floor(BCR.width) *
            -1;
        }

        //  call stepper animation
        if (
          timelinePercentMovementRef.current !== 0 &&
          !timelineStepperRef.current &&
          !isStopped.current
        ) {
          timelineStepperRef.current = requestAnimationFrame(() => {
            timelineStep(event);
          });
        }

        // cancel stepper animation
        if (
          timelinePercentMovementRef.current === 0 &&
          timelineStepperRef.current
        ) {
          cancelAnimationFrame(timelineStepperRef.current);
          timelineStepperRef.current = null;
        }
      }
    },
    onHover: ({ active, xy, event }) => {
      if (timelineContainer.current && !isStopped.current) {
        const BCR = timelineContainer.current.getBoundingClientRect();

        // calculate percent (mouse position)
        const percent =
          ((xy[0] - Math.floor(BCR.x)) / Math.floor(BCR.width)) * 100;

        // calculate boundaries (base on mouse position)
        const newLeft = BCR.x + (percent / 100) * BCR.width * (1 - scale);
        const newRight = newLeft + BCR.width * scale;

        const leftBoundary = Math.abs(newLeft - BCR.x) / scale;
        const rightBoundary =
          (Math.abs(newRight - (BCR.x + BCR.width)) * -1) / scale;

        timelineBoundaries.current = {
          left: leftBoundary,
          right: rightBoundary,
        };

        // inital hover effect & reset hover effect
        if (active) {
          // inital dot aniamtion

          dotApi.set({ x: (percent / 100) * BCR.width });
          dotApi.start({ opacity: 1, tetherOpacity: 1 });

          // inital timeline animation
          timelineApi.set({ origin: percent });
          timelineApi.start({ scale: scale });

          const percentDate = percentToDate(event, year);

          const dateModal = document.getElementById("date-picker-modal");

          hoverDateRef.current = percentDate;
          if (dateModal) {
            const newDate = format(hoverDateRef.current, "iiii, LLLL d");
            (dateModal as HTMLInputElement).value = newDate;
          }
        } else {
          // stop stepper animation
          if (timelineStepperRef.current) {
            cancelAnimationFrame(timelineStepperRef.current);
          }

          // reset timeline state
          timelineBoundaries.current = { left: -10000, right: 10000 };
          timelineDeltaRef.current = 0;
          timelineMovementRef.current = 0;

          // reset timeline animation
          // timelineApi.set({ origin: percentValueRef.current });

          timelineApi.start({ scale: 1, x: 0 });

          // reset dot animation
          dotApi.start({ tetherOpacity: 0, opacity: 0, scale: 1 });

          setHoverDate(hoverDateRef.current);
        }
      }
    },
  });

  //   useEffect(() => {
  //     console.log(hoverDate);
  //     // console.log(hoverDateRef.current);
  //   }, [hoverDate]);

  return (
    <>
      <div
        {...bind()}
        className={styles.TimelineContainer}
        onClick={() => {
          isStopped.current = true;
          if (timelineStepperRef.current) {
            cancelAnimationFrame(timelineStepperRef.current);
          }

          timelineApi.start({
            scale: scale,
            x: timelineMovementRef.current / (scale / 2),
          });

          dotApi.start({ tetherOpacity: 0 });

          setCreateDate(hoverDateRef.current);
          setHoverDate(hoverDateRef.current);
        }}
        ref={timelineContainer}
      >
        <Timeline timelineSpring={timelineSpring} />
        <Dot dotSpringValue={dotSpring} />
      </div>

      <div className={styles.DatePickerContainer}>
        <DatePickerModal
          date={hoverDate}
          setValue={(date) => {
            setCreateDate(date);
          }}
        />
      </div>

      {createDate && (
        <CreateTimelineModal date={createDate} onClose={closeModal} />
      )}
    </>
  );
}

type DotSpringValue = SpringValues<{
  scale: number;
  x: number;
  opacity: number;
  tetherOpacity: number;
}>;
function Dot({ dotSpringValue }: { dotSpringValue: DotSpringValue }) {
  return (
    <animated.div
      className={styles.TetherContainer}
      style={{
        opacity: dotSpringValue.opacity,
        transform: to([dotSpringValue.x], (x) => ` translate(${x}px)`),
      }}
    >
      <animated.div
        className={styles.Tether}
        style={{
          opacity: dotSpringValue.tetherOpacity,
          transform: to(
            [dotSpringValue.scale],
            (scale) => `scaleX(${scale}) translateY(-50%)`
          ),
        }}
      ></animated.div>

      <animated.div
        className={styles.Dot}
        style={{
          opacity: dotSpringValue.opacity,
          transform: to(
            [dotSpringValue.scale],
            (x) => ` translate(${x - 4.5}px , -50%)`
          ),
        }}
      ></animated.div>
    </animated.div>
  );
}
