import styles from "./TimelineYear.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { month_data, current } from "../../../tools/data";

export default function TimelineYearPage({
  selectMonth,
  selectedMonth,
}: {
  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  return (
    <>
      <MonthDivYearContainer
        selectMonth={selectMonth}
        selectedMonth={selectedMonth}
      />
      <MonthMarkersYearContainer
        selectMonth={selectMonth}
        selectedMonth={selectedMonth}
      />
    </>
  );
}

// Month Markers (year page)
export function MonthMarkersYearContainer({
  selectMonth,
  selectedMonth,
}: {
  selectMonth: (index: number) => void;
  selectedMonth: number;
}) {
  return (
    <div className={styles.timeLineMonthLine}>
      {Object.keys(month_data).map((_: string, index: number) => {
        return (
          <MonthMarkerYear
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

export function MonthMarkerYear({
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
 * @returns
 */

// Month Divs Container(year page)
export function MonthDivYearContainer({
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
          <MonthDivYear
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

// Month Divs(year page)
function MonthDivYear({
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
