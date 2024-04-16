import { useNavigate } from "react-router-dom";
import styles from "./TLComponents.module.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";
import { useMemo } from "react";
import { monthByIndex } from "../../../tools/data/monthData";

export function YearNavigation({ year }: { year: number }) {
  const navigate = useNavigate();

  return (
    <div className={styles.YearNav}>
      <button
        onClick={() => {
          navigate(`/year/${year - 1}/view`);
        }}
      >
        <MdOutlineArrowBackIos color={"rgb(150,150,150)"} />
      </button>

      <div className={styles.YearNavText}>{year}</div>

      <button
        onClick={() => {
          navigate(`/year/${year + 1}/view`);
        }}
      >
        <MdOutlineArrowForwardIos color={"rgb(150,150,150)"} />
      </button>
    </div>
  );
}

export function PoleMenu({ poles }: { poles: StandardPoleData[] }) {
  const sortedPoles = useMemo(() => {
    const poleObj: { [month: string]: StandardPoleData[] } = {};
    for (let i = 0; i < poles.length; i++) {
      const month = monthByIndex[poles[i].month + 1].month;

      if (!poleObj[month]) {
        poleObj[month] = [];
      }

      poleObj[month].push(poles[i]);
    }

    const poleObjKey = Object.keys(poleObj);

    for (let i = 0; i < poleObjKey.length; i++) {
      const sortByDate = (pole1: StandardPoleData, pole2: StandardPoleData) => {
        const date1 = new Date(pole1.full_date).getTime();
        const date2 = new Date(pole2.full_date).getTime();
        return date1 - date2;
      };

      const sortedPoleObj = [...poleObj[poleObjKey[i]]].sort(sortByDate);

      poleObj[poleObjKey[i]] = sortedPoleObj;
    }

    return poleObj;
  }, [poles]);

  return (
    <div className={styles.PoleMenu}>
      <div className={styles.PMBar}></div>
      <div className={styles.PMBody}>
        {Object.keys(sortedPoles).map((_monthKey) => {
          return (
            <PoleMenuSection
              key={_monthKey}
              month={_monthKey}
              poleArr={sortedPoles[_monthKey]}
            ></PoleMenuSection>
          );
        })}
      </div>
    </div>
  );
}

function PoleMenuSection({
  month,
  poleArr,
}: {
  month: string;
  poleArr: StandardPoleData[];
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.PMSection}>
      <p>{month}</p>
      {poleArr.map((_pole) => {
        return (
          <div
            key={_pole.id}
            className={styles.PMtext}
            onClick={() => {
              navigate(`/month/${_pole.year}/${_pole.month + 1}/view`);
            }}
          >
            {_pole.date} - {_pole.title}
          </div>
        );
      })}
    </div>
  );
}
