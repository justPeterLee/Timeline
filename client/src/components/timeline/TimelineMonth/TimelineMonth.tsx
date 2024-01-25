import styles from "./TimelineMonth.module.css";
import { month_data } from "../../../tools/data";
import { useParams } from "react-router-dom";
interface MonthsData {
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

type MonthDataSection = {
  month: string;
  day: number;
  weeks: number;
  startDay: number;
  index: number;
};

export default function TimelineMonthPage() {
  const { month } = useParams();

  const selectedMonthData = () => {
    const monthInt = month ? parseInt(month) : -1;
    const current = monthInt - 1;
    const following = monthInt < 12 ? monthInt : 0;
    const previous = monthInt > 1 ? monthInt - 2 : 11;
    return {
      previous: month_data[previous],
      current: month_data[current],
      following: month_data[following],
    };
  };

  const data = selectedMonthData();

  return (
    <>
      <MonthDivMonthContainer monthsData={data} />
      <MonthMarkersMonthContainer monthsData={data} />
    </>
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
 * @returns
 */

// Month Divs Container (month)
export function MonthDivMonthContainer({
  monthsData,
}: {
  monthsData: MonthsData;
}) {
  return (
    <div className={styles.timeLineMonthContainer}>
      {/* {JSON.stringify(viewMonth)} */}
      {Object.keys(monthsData).map((month: string, index: number) => {
        return (
          <MonthDivMonth
            key={index}
            state={month}
            data={monthsData[month as keyof MonthsData]}
          />
        );
      })}
    </div>
  );
}

// Month Div (month)
function MonthDivMonth({
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

/**
 *
 * @returns
 *
 *
 *
 *
 *
 *
 */

// Month Markers Container (month)
export function MonthMarkersMonthContainer({
  monthsData,
}: {
  monthsData: MonthsData;
}) {
  return (
    <div className={styles.timeLineMonthLine}>
      {Object.keys(monthsData).map((_state: string, index: number) => {
        return (
          <MonthMarker
            key={index}
            state={_state}
            data={monthsData[_state as keyof MonthsData]}
          />
        );
      })}
    </div>
  );
}

// Month Marker (month)
function MonthMarker({
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
