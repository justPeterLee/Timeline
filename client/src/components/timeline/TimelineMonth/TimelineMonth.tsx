import styles from "./TimelineMonth.module.css";
import { month_data, current } from "../../../tools/data";
import { useParams, useNavigate } from "react-router-dom";
import {
  TodayTrackerYear,
  CreateTimeline,
  LinkSection,
} from "../timeline_components/TimelineComponents";

import { LinkBox, VisualBox, DataBox } from "../timelineBox/TimelineBox";
// import {}
// import { UseAppDis } from "react-redux";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/redux-hooks/redux.hook";
import { useEffect, useMemo } from "react";
import { sortPolesMonths } from "../../../tools/utilities/timepoleUtils/timepole";
import { TimePoleDisplay } from "../../timepole/Timepole";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";

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
  const { month, mode, year } = useParams();
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  const polesByMonth = useMemo(() => {
    if (poles[0] === "loading") return "loading";
    const poleMonthData = sortPolesMonths(poles, month);
    if (poleMonthData === "error") return "error";

    return poleMonthData;
  }, [poles, month]);

  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, []);

  if (polesByMonth === "loading") return <>loading</>;
  if (polesByMonth === "error") return <>error</>;
  return (
    <>
      <VisualBox url={"month"}>
        <div id={"monthMarkers"}>
          {/* <MonthMarker state=/> */}
          {Object.keys(data).map((month, index) => {
            return (
              <MonthMarker
                key={index}
                state={month}
                data={data[month as keyof MonthsData]}
              />
            );
          })}
        </div>

        <div className={styles.mainView} id={"dayMarkers"}>
          {Array.from({ length: data.current.day - 1 }, (_, index) => {
            return (
              <WeekMarker
                key={index}
                index={index + 1}
                day={data.current.day}
              />
            );
          })}
        </div>
      </VisualBox>

      <LinkBox>
        <LinkSection
          url={`/month/${year}/${data.previous.index}/${mode}`}
          style={{ width: "5%", height: "30px", left: "0" }}
        />
        <LinkSection
          url={`/month/${year}/${data.following.index}/${mode}`}
          style={{ width: "5%", height: "30px", right: "0" }}
        />
        {/* <div></div> */}
      </LinkBox>

      <DataBox data={""}>
        <div className={styles.mainView}>
          <TimePoleDisplay url={"month"} poles={polesByMonth} />
        </div>
      </DataBox>

      {mode === "create" && (
        <CreateTimeline monthData={month_data[parseInt(month!) - 1]} />
      )}
      {/* <MonthDivMonthContainer monthsData={data} polesByMonth={polesByMonth} /> */}
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
  polesByMonth,
}: {
  monthsData: MonthsData;
  polesByMonth: StandardPoleData[];
}) {
  console.log(monthsData);
  return (
    <div className={styles.timeLineMonthContainer}>
      {/* {JSON.stringify(viewMonth)} */}
      {Object.keys(monthsData).map((month, index) => {
        return (
          <MonthDivMonth
            key={index}
            state={month}
            data={monthsData[month as keyof MonthsData]}
            polesByMonth={polesByMonth}
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
  polesByMonth,
}: {
  state: string;
  data: {
    month: string;
    day: number;
    weeks: number;
    startDay: number;
    index: number;
  };
  polesByMonth: StandardPoleData[];
}) {
  // const navigate = useNavigate();
  // const { year, mode } = useParams();

  return (
    <div
      id={state}
      className={styles.monthViewDiv}
      style={{
        width: state === "current" ? "90%" : "5%",
      }}
      // onClick={() => {
      //   if (state === "previous" || state === "following") {
      //     navigate(`/month/${year}/${data.index}/${mode}`);
      //   }
      // }}
    >
      {/* <MonthMarker state={state} data={data} /> */}
      {/* {state === "current" && <AccurateWeekMarkersContainer data={data} />} */}
      {state === "current" ? (
        data.index - 1 === current.today.month ? (
          <TodayTrackerYear accurate={true} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {state === "current" && (
        <TimePoleDisplay url={"month"} poles={polesByMonth} />
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
        left:
          state === "previous" ? "0%" : state === "following" ? "95%" : "5%",
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
  // console.log(day, index);
  return (
    <div
      className={styles.weekMarker}
      id={`${index + 1}`}
      style={{ left: `${(100 / day) * index}%` }}
    ></div>
  );
}
