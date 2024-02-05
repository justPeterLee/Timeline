import styles from "./TimelineComponents.module.css";
import { current, month_data, getDateFromDayOfYear } from "../../../tools/data";
import { ChangeEvent, useEffect, useState } from "react";
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

export function CreateTimeline() {
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

      const day = Math.floor((x * 100) / 0.27397260274 + 1);
      if (day >= 1 && day <= 365) {
        setDayOfYear(getDateFromDayOfYear(day, 2024));
      }
    }
  };

  const handleClickMouse = () => {
    setSelectedDOY(() => {
      return dayOfYear;
    });
  };

  return (
    <>
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
        onClick={() => {
          handleClickMouse();
          // setToggle(() => false);
        }}
      >
        <div
          className={styles.createMarker}
          style={{
            transform: `translate(${xPercent}%, -50%)`,
            opacity: toggle || selectedDOY ? "100%" : "0%",
          }}
        ></div>
      </div>
      {
        <CreatePoleModal
          xPercent={xPercent}
          date={selectedDOY}
          onClose={() => {
            setSelectedDOY(null);
          }}
        />
      }
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
import { Backdrop } from "../../elements/Links";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import React from "react";

function CreatePoleModal({
  xPercent,
  date,
  onClose,
}: {
  xPercent: number;
  date: Date | null;
  onClose: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState(date);

  const dateSelector = (e: Date) => {
    setSelectedDate(e);
  };
  const [value, setValue] = useState<TimepoleType>({
    title: "",
    description: "",
    date: date,
  });

  const [error, setError] = useState<any>({ custom: false });

  const postTimepole = () => {
    if (value.title.replace(/\s+/g, "")) {
      setError({ custom: false });
    } else {
      setError({ custom: true });
    }
  };

  const onClear = () => {
    setError({ custom: false });
    setValue({
      title: "",
      description: "",
      date: date,
    });
    onClose();
  };
  const CustomInput = React.forwardRef<
    HTMLInputElement,
    { value: any; onClick: any }
  >(({ value, onClick }) => (
    <button onClick={onClick} value={value}>
      {value}
    </button>
  ));

  const minDate = new Date("2024-01-01");
  const maxDate = new Date("2024-12-31");
  useEffect(() => {
    setValue({ ...value, date: date });
    if (date) setSelectedDate(date);
  }, [date]);

  if (!date) {
    return <></>;
  }

  return (
    <>
      {date && <Backdrop onClose={onClear} />}
      <div
        className={styles.poleModalContainer}
        style={{
          transform: `translate(${xPercent}%, -50%)`,
          display: date ? "flex" : "none",
          // opacity: date ? "100%" : "0%",
        }}
      >
        <div className={styles.inputContainer}>
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
            minDate={minDate}
            maxDate={maxDate}
          />

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              id={styles.createButton}
              onClick={() => {
                postTimepole();
              }}
            >
              create
            </button>
          </div>
        </div>
        <Timepole height={"100px"} />
      </div>
    </>
  );
}
