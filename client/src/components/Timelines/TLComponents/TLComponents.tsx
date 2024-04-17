import { useNavigate } from "react-router-dom";
import styles from "./TLComponents.module.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";
import { useMemo, useRef, useState } from "react";
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

import { RiDraggable } from "react-icons/ri";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";
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

  const [toggleBody, setToggleBody] = useState(true);
  const dragTarget = useRef<HTMLDivElement | null>(null);

  const [menuSpring, menuApi] = useSpring(() => {
    return {
      x: 0,
      y: 0,
    };
  });
  const bind = useDrag(({ down, offset: [mx, my] }) => {
    if (down) {
      console.log("is down");
      menuApi.set({ x: mx, y: my });
    }

    if (!down) {
      console.log("is up");
    }
  });

  return (
    <animated.div className={styles.PoleMenu} style={{ ...menuSpring }}>
      <div className={styles.PMBar}>
        <div
          {...bind()}
          ref={dragTarget}
          className={styles.PMBdrag}
          onMouseDown={() => {
            if (dragTarget.current) {
              dragTarget.current.style.cursor = "grabbing";
            }
          }}
          onMouseUp={() => {
            if (dragTarget.current) {
              dragTarget.current.style.cursor = "grab";
            }
          }}
          //   style={{ cursor: `${isGrabbing ? "grabbing" : "grab"}` }}
        >
          <RiDraggable />
        </div>
        <div className={styles.PMBtext}>
          <p>Menu</p>
        </div>
        <button
          className={styles.PMBbutton}
          onClick={() => {
            setToggleBody(!toggleBody);
          }}
        >
          <MdOutlineArrowBackIos
            color={"rgb(150,150,150)"}
            style={{ transform: `rotate(${toggleBody ? 270 : 90}deg)` }}
            className={styles.PMBbuttonIcon}
          />
        </button>
      </div>

      {toggleBody && (
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
      )}
    </animated.div>
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
