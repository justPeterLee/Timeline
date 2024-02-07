import styles from "./TimelineComponents.module.css";
import { current, month_data, getDateFromDayOfYear } from "../../../tools/data";
import { useEffect, useState } from "react";
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
        style={{ stroke: "rgb(150,150,150)", strokeWidth: "2" }}
      />
    </svg>
  );
}

import { format } from "date-fns";
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

  const clear = () => {
    setSelectedDOY(null);
  };

  return (
    <>
      {selectedDOY && <Backdrop onClose={clear} />}
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
          <CreatePoleModal xPercent={xPercent} date={selectedDOY} />
        )}
      </div>
    </>
  );
}

interface TimepoleType {
  title: string;
  description: string;
  date: Date | null;
}
import { Timepole } from "../../timepole/Timepole";
import { ValidInput } from "../../elements/Links";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

import { useDispatch, useSelector } from "react-redux";

function CreatePoleModal({
  xPercent,
  date,
}: {
  xPercent: number;
  date: Date | null;
}) {
  // dependencies
  const dispatch = useDispatch();
  const user = useSelector((store: any) => store.userAccount);
  // ------- time pole values -------
  const [value, setValue] = useState<TimepoleType>({
    title: "",
    description: "",
    date: date,
  });

  const [error, setError] = useState<any>({ custom: false });

  const timepoleValidator = () => {
    if (value.title.replace(/\s+/g, "") && value.date) {
      // NO ERROR
      setError({ custom: false });
      return true;
    }

    // ERROR
    setError({ custom: true });
    return false;
  };

  const postTimepole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!timepoleValidator()) return;

    const date_data = {
      date: date!.getDate(),
      month: date!.getMonth(),
      year: date!.getFullYear(),
      day: date!.getDay(),
      full_date: date!.toISOString(),
    };

    if (user) {
      dispatch({
        type: "CREATE_TIMEPOLE_SERVER",
        payload: {
          title: value.title,
          description: value.description,
          date_data,
        },
      });
    } else {
      console.log("create on local storage");
    }
  };
  // ------- date picker --------
  const [selectedDate, setSelectedDate] = useState(date);

  const dateSelector = (e: Date) => {
    setValue({ ...value, date: e });
    setSelectedDate(e);
  };

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    { value: any; onClick: any }
  >(({ value, onClick }, ref) => (
    <button onClick={onClick} value={value} type="button">
      {value}
    </button>
  ));

  // ------- inital setup --------

  useEffect(() => {
    setValue({ ...value, date: date });
    if (date) setSelectedDate(date);
  }, [date]);

  useEffect(() => {
    // console.log("updated user");
    dispatch({ type: "FETCH_USER" });
  }, []);
  if (!date) {
    return <></>;
  }

  return (
    <>
      <div
        className={styles.poleModalContainer}
        style={{
          transform: `translateX(${xPercent}%)`,
          display: date ? "flex" : "none",
          // opacity: date ? "100%" : "0%",
        }}
      >
        <form
          className={styles.inputContainer}
          onSubmit={(e) => postTimepole(e)}
        >
          <ValidInput
            label="title"
            errorLabel="invalid title"
            error={{ custom: error.custom }}
            setValue={(newValue) => {
              if (error.custom) {
                setError({ ...error, custom: false });
              }
              setValue({ ...value, title: newValue });
            }}
            value={value.title}
          />
          <ValidInput
            label="description"
            placeholder="(optional)"
            setValue={(newValue) => {
              setValue({ ...value, description: newValue });
            }}
            value={value.description}
          />

          <DatePicker
            selected={selectedDate}
            onChange={(e: Date) => {
              dateSelector(e);
            }}
            customInput={<CustomInput value={undefined} onClick={undefined} />}
            dateFormat="EEEE, LLLL d"
            minDate={new Date("2024-01-01")}
            maxDate={new Date("2024-12-31")}
          />

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              id={styles.createButton}
              type="submit"
            >
              create
            </button>
          </div>
        </form>
        <Timepole height={"100px"} />
      </div>
    </>
  );
}

export function WeekMarkers() {
  return (
    <div className={styles.weekMarkersContainer}>
      {Array.from({ length: 52 }, (_, index) => {
        return <MiniMarkers key={index} index={index} />;
      })}
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
