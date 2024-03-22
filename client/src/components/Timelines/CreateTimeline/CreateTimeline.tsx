import styles from "./CreateTimeline.module.css";
import { animated, useSpring, to, SpringValues } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useRef } from "react";
import { Timeline } from "../Timeline/Timeline";

export function CreateTimeline() {
  const timelineContainer = useRef<null | HTMLDivElement>(null);
  const scale = 10;
  const percentValueRef = useRef(0);

  const timelineStepperRef = useRef<number | null>(null);
  const timelineBoundaries = useRef({ left: -10000, right: 10000 });
  const timelineDeltaRef = useRef(0);
  const timelinePercentMovementRef = useRef(0);
  const timelineMovementRef = useRef(0);

  const isStopped = useRef(false);

  const timelineStep = () => {
    console.log("step");
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
    timelineStepperRef.current = requestAnimationFrame(timelineStep);
  };

  const [timelineSpring, timelineApi] = useSpring(() => ({
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
  }));

  const bind = useGesture({
    onMove: ({ xy, delta }) => {
      // calculate percent
      if (timelineContainer.current) {
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
          timelineStepperRef.current = requestAnimationFrame(timelineStep);
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
    onHover: ({ active, xy }) => {
      if (timelineContainer.current) {
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
          dotApi.start({ opacity: 1 });

          // inital timeline animation
          timelineApi.set({ origin: percent });
          timelineApi.start({ scale: scale });
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
          dotApi.start({ opacity: 0, scale: 1 });
        }
      }
    },
  });

  return (
    <div
      {...bind()}
      className={styles.TimelineContainer}
      onClick={(e) => {
        isStopped.current = true;
        if (timelineStepperRef.current) {
          cancelAnimationFrame(timelineStepperRef.current);
        }

        const timelineBCR = document
          .getElementById("timeline")!
          .getBoundingClientRect();
        const mousePos = e.clientX;
        const timelineX = timelineBCR.x;
        const timelineWidth = timelineBCR.width;
        const timelinePercent = Math.abs(timelineX - mousePos) / timelineWidth;
        console.log(timelinePercent);
      }}
      ref={timelineContainer}
    >
      <Timeline timelineSpring={timelineSpring} />
      <Dot dotSpringValue={dotSpring} />
    </div>
  );
}

type DotSpringValue = SpringValues<{
  scale: number;
  x: number;
  opacity: number;
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
          // opacity: springValue.opacity,
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
