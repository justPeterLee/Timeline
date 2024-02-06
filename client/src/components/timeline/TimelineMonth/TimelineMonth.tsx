import styles from "./TimelineMonth.module.css";
import { month_data, current } from "../../../tools/data";
import { useParams, useNavigate } from "react-router-dom";
import {
  TodayTrackerYear,
  CreateTimeline,
} from "../timeline_components/TimelineComponents";
// import {}
interface MonthsData {
  current: MonthDataSection;
  previous: MonthDataSection;
  following: MonthDataSection;
}

type MonthDataSection = {
  month: string;
  day: number;
  weeks: number;
  startDay: number;
  index: number;
};

export default function TimelineMonthPage() {
  const { month, mode } = useParams();

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
      {mode === "create" && (
        <CreateTimeline monthData={month_data[parseInt(month!) - 1]} />
      )}
      <MonthDivMonthContainer monthsData={data} />
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
  data,
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
  const navigate = useNavigate();
  const { year, mode } = useParams();

  return (
    <div
      className={styles.monthViewDiv}
      style={{
        width: state === "current" ? "90%" : "5%",
      }}
      onClick={() => {
        if (state === "previous" || state === "following") {
          navigate(`/month/${year}/${data.index}/${mode}`);
        }
      }}
    >
      <MonthMarker state={state} data={data} />
      {state === "current" && <AccurateWeekMarkersContainer data={data} />}
      {state === "current" ? (
        data.index - 1 === current.today.month ? (
          <TodayTrackerYear accurate={true} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
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
        // left:
        //   state === "previous"
        //     ? "0%"
        //     : state === "following"
        //     ? "91.5068493151%"
        //     : "10%",
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

export function AccurateWeekMarkersContainer({
  data,
}: {
  data: MonthDataSection;
}) {
  return (
    <div
      className={styles.weekMarkerContainer}
      // style={{ left: `${data.day / 100}%` }}
    >
      {Array.from({ length: data.day - 1 }, (_, index) => {
        return <WeekMarker key={index} index={index + 1} day={data.day} />;
      })}
    </div>
  );
}

export function WeekMarker({ index, day }: { index: number; day: number }) {
  return (
    <div
      className={styles.weekMarker}
      id={`${index + 1}`}
      style={{ left: `${(100 / day) * index}%` }}
    ></div>
  );
}
