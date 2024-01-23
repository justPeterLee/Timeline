import styles from "./TimelineMonth.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function TimelineMonth({
  monthData,
  index,
  selectMonth,
  selectedMonth,
}: {
  monthData: { month: string; day: number; weeks: number };
  index: number;

  selectMonth: (index: number) => void;
  selectedMonth: null | number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();
  const currentYear = new Date().getFullYear();
  return (
    <div
      className={styles.extentionContainer}
      style={{
        width: `${monthData.day * 0.274}%`,
      }}
      onClick={() => {
        navigate(`/${year || currentYear}/${index + 1}/${mode || "view"}`);
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
  selectedMonth: null | number;
}) {
  const navigate = useNavigate();
  const { year, mode } = useParams();
  const currentYear = new Date().getFullYear();
  return (
    <div
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
        navigate(`/${year || currentYear}/${index + 1}/${mode || "view"}`);
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
            navigate(`/${year || currentYear}/${index + 1}/${mode || "view"}`);
          }}
        >
          {monthData.month}
        </p>
      </div>
    </div>
  );
}
