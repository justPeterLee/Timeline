import { useMemo } from "react";
import { AllStandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import styles from "./PoleSection.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
// import {format}
export function PoleSectionContainer({
  poles,
}: {
  poles: {
    [key: string]: { [key: string]: AllStandardPoleData[] };
  };
}) {
  const polesKeys = useMemo(() => {
    return Object.keys(poles);
  }, [poles]);
  return (
    <div className={styles.PoleSectionContainer}>
      {/* <p>{}</p> */}
      {polesKeys.map((_pole) => {
        const poleData = poles[_pole];
        return <PoleSection key={_pole} poleDataObj={poleData} year={_pole} />;
      })}
    </div>
  );
}

function PoleSection({
  poleDataObj,
  year,
}: {
  poleDataObj: { [key: string]: AllStandardPoleData[] };
  year: string;
}) {
  const navigate = useNavigate();
  const monthArr = Object.keys(poleDataObj);
  return (
    <div
      className={styles.PoleSection}
      onClick={() => {
        navigate(`/year/${year}/view`);
      }}
    >
      <div className={styles.Year}>
        <p>{year}</p>
      </div>

      <div className={styles.Month}>
        {monthArr.map((_poleMonth) => {
          const poleDataArr = poleDataObj[_poleMonth];
          return (
            <MonthSection
              key={_poleMonth}
              poleDataArr={poleDataArr}
              month={_poleMonth}
            />
          );
        })}
      </div>
    </div>
  );
}

function MonthSection({
  poleDataArr,
  month,
}: {
  poleDataArr: AllStandardPoleData[];
  month: string;
}) {
  //   console.log(poleDataArr);
  return (
    <div className={styles.MonthSection}>
      {/* <div className={styles.MonthTitle}>
        <p>{month}</p>
      </div> */}
      <div className={styles.MonthSectionContainer}>
        {poleDataArr.map((_pole) => (
          <Section key={_pole.id} poleData={_pole} />
        ))}
      </div>
    </div>
  );
}

function Section({ poleData }: { poleData: AllStandardPoleData }) {
  return (
    <div className={styles.Section}>
      {/* {" "} */}
      <p style={{ fontSize: "12px" }}>
        {format(new Date(poleData.full_date), "MMM io")}
      </p>
      <p>{poleData.title}</p>
    </div>
  );
}
