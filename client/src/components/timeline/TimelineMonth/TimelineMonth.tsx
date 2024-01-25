import styles from "./TimelineMonth.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { current, month_data } from "../../../tools/data";

export function TimelineYearView({
  selectMonth,
  selectedMonth,
}: {
  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  return (
    <div className={styles.timeLineMonthContainer}>
      {Object.keys(month_data).map((_instance: string, index: number) => {
        return (
          <TimelineMonth
            key={index}
            monthData={month_data[index]}
            index={index}
            selectMonth={selectMonth}
            selectedMonth={selectedMonth}
          />
        );
      })}
    </div>
  );
}

function TimelineMonth({
  monthData,
  index,
  selectMonth,
  selectedMonth,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;

  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();
  return (
    <div
      className={styles.extentionContainer}
      style={{
        width: `${monthData.day * 0.274}%`,
      }}
      onClick={() => {
        navigate(`/${year || current.year}/${index + 1}/${mode || "view"}`);
      }}
      onMouseOver={() => {
        selectMonth(index);
      }}
      onMouseOut={() => {
        selectMonth(-1);
      }}
    >
      <div
        className={styles.container}
        style={{
          backgroundColor:
            selectedMonth === index ? "rgb(242,242,242)" : "initial",
        }}
      >
        <div
          className={styles.month}
          style={{
            justifyContent: index % 2 <= 0 ? "flex-end" : "flex-start",
          }}
        ></div>

        <div className={styles.weekLineContainer}>
          {Array.from({ length: monthData.weeks }, (_, index) => {
            return (
              <div
                className={styles.weekLine}
                key={index}
                style={{
                  backgroundColor:
                    index === 0 ? "transparent" : "rgb(200, 200, 200)",
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MonthLine({
  monthData,
  index,
  selectMonth,
  selectedMonth,
}: {
  monthData: { month: string; day: number; weeks: number; startDay: number };
  index: number;

  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();
  return (
    <div
      id={`${index}`}
      className={styles.month}
      style={{
        top: index % 2 <= 0 ? "0%" : "-15px",
        left: `${monthData.startDay * 0.27397260274}%`,
      }}
      onMouseOver={() => {
        selectMonth(index);
      }}
      onMouseOut={() => {
        selectMonth(-1);
      }}
      onClick={() => {
        navigate(`/${year || current.year}/${index + 1}/${mode || "view"}`);
      }}
    >
      <div className={styles.monthLine}></div>

      <div
        className={styles.monthAbrContainer}
        style={{
          alignItems: `${index % 2 === 0 ? "flex-end" : "flex-start"}`,
          bottom: `${index % 2 === 0 ? "" : "0"}`,
        }}
        onMouseOver={() => {
          selectMonth(index);
        }}
        onMouseOut={() => {
          selectMonth(-1);
        }}
      >
        <p
          style={{ opacity: selectedMonth === index ? "80%" : "30%" }}
          onClick={() => {
            navigate(`/${year || current.year}/${index + 1}/${mode || "view"}`);
          }}
        >
          {monthData.month}
        </p>
      </div>
    </div>
  );
}

/**
 *
 * @param param0
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * @returns
 */

interface ViewMonth {
  current: {
    month: string;
    day: number;
    weeks: number;
    startDay: number;
    index: number;
  };
  previous: {
    month: string;
    day: number;
    weeks: number;
    startDay: number;
    index: number;
  };
  following: {
    month: string;
    day: number;
    weeks: number;
    startDay: number;
    index: number;
  };
}

export function TimelineMonthView({ viewMonth }: { viewMonth: ViewMonth }) {
  return (
    <div className={styles.timeLineMonthContainer}>
      {/* {JSON.stringify(viewMonth)} */}
      {Object.keys(viewMonth).map((month: string, index: number) => {
        return (
          <MonthViewDiv
            key={index}
            state={month}
            data={viewMonth[month as keyof ViewMonth]}
          />
        );
      })}
    </div>
  );
}

function MonthViewDiv({
  state,
}: {
  state: string;
  data: {
    month: string;
    day: number;
    weeks: number;
    startDay: number;
    index: number;
  };
}) {
  return (
    <div
      className={styles.monthViewDiv}
      style={{
        width: state === "current" ? "83.0136986301%" : "8.49315068493%",
      }}
    >
      {/* {state} {JSON.stringify(data)} */}
    </div>
  );
}

type MonthDataSection = {
  month: string;
  day: number;
  weeks: number;
  startDay: number;
  index: number;
};
export function MonthLineViewLine({
  state,
  data,
}: // index,
{
  state: string;
  data: MonthDataSection;
  // index: number;
}) {
  return (
    <div
      id={`${data.index - 1}`}
      className={styles.month}
      style={{
        top: (data.index - 1) % 2 <= 0 ? "0%" : "-15px",
        left:
          state === "previous"
            ? "0%"
            : state === "following"
            ? "91.5068493151%"
            : "8.49315068493%",
      }}
    >
      <div className={styles.monthLine}></div>

      <div
        className={styles.monthAbrContainer}
        style={{
          alignItems: `${data.index % 2 !== 0 ? "flex-end" : "flex-start"}`,
          bottom: `${data.index % 2 !== 0 ? "" : "0"}`,
        }}
      >
        <p>{data.month}</p>
      </div>
    </div>
  );
}
