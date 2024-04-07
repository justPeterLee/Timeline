import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AllStandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import styles from "./PoleSection.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Modal } from "../elements/Links";
import { current } from "../../tools/data/monthData";
// import {format}
export function PoleSectionContainer({
  poles,
}: {
  poles: {
    [key: string]: { [key: string]: AllStandardPoleData[] };
  };
}) {
  const [createModal, setCreateModal] = useState(false);

  const polesKeys = useMemo(() => {
    return Object.keys(poles);
  }, [poles]);
  return (
    <>
      <div className={styles.PoleSectionContainer}>
        {/* <p>{}</p> */}
        {polesKeys.map((_pole) => {
          const poleData = poles[_pole];
          return (
            <PoleSection key={_pole} poleDataObj={poleData} year={_pole} />
          );
        })}
        <div
          className={styles.CreateNewYear}
          onClick={() => {
            setCreateModal(true);
          }}
        ></div>
      </div>

      {createModal && (
        <Modal
          onClose={() => {
            setCreateModal(false);
          }}
        >
          <CreateNewYearModal
            onClose={() => {
              setCreateModal(false);
            }}
          />
        </Modal>
      )}
    </>
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
              //   month={_poleMonth}
            />
          );
        })}
      </div>
    </div>
  );
}

function MonthSection({
  poleDataArr,
}: //   month,
{
  poleDataArr: AllStandardPoleData[];
  //   month: string;
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

import { IoMdArrowDropdown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useAppDispatch } from "../../redux/redux-hooks/redux.hook";

function CreateNewYearModal({ onClose }: { onClose: () => void }) {
  const dataListTargetRef = useRef<null | HTMLDivElement>(null);
  const listTargetRef = useRef<{ scollIntoView: () => void } | null>(null);

  const [selectedYear, setSelectedYear] = useState(current.year);
  const [focus, setFocus] = useState(false);

  const dispatch = useAppDispatch();

  const createTimeline = () => {
    dispatch({ type: "GET_TIMELINE_SERVER" });
  };
  useEffect(() => {
    if (focus && listTargetRef.current) {
      console.log("scroll to middle");
      listTargetRef.current.scollIntoView();
    }
  }, [focus, listTargetRef]);

  return (
    <div className={styles.CreateNewYearModal}>
      <div className={styles.CNYMTitle}>
        <p>Create New Timeline</p>
      </div>

      <div className={styles.CNYMInput}>
        <button
          className={styles.CNYMDatalist}
          onClick={() => {
            setFocus(!focus);
          }}
        >
          <div
            className={styles.CNYMYear}
            style={focus ? { border: "solid 1px rgb(200,200,200)" } : {}}
          >
            <p>{selectedYear}</p>
            <IoMdArrowDropdown className={styles.CNYMDropIcon} />
          </div>
        </button>

        {focus && (
          <div
            className={styles.CNYMYearDatalistValues}
            ref={dataListTargetRef}
          >
            <NewYearDataList
              value={selectedYear}
              setValue={(newYear) => {
                setSelectedYear(newYear);
                setFocus(false);
                //   onClose();
              }}
              ref={listTargetRef}
            />
          </div>
        )}
      </div>

      <div className={styles.CNYMButton}>
        <button className={styles.CNYMCancel} onClick={onClose}>
          cancel
        </button>
        <button className={styles.CNYMCreate} onClick={createTimeline}>
          create
        </button>
      </div>
    </div>
  );
}

const NewYearDataList = forwardRef(function NewYearDataList(
  {
    value,
    setValue,
  }: {
    value: number;
    setValue: (newYear: number) => void;
  },
  ref
) {
  const listTargetRef = useRef<null | HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      scollIntoView() {
        listTargetRef.current!.scrollIntoView();
      },
    };
  });

  return (
    <div className={styles.DataListContainer}>
      {Array.from({ length: 11 }, (_, index) => {
        const position = index;
        const listValue = value - 5 + position;
        const isSelected = listValue === value ? true : false;

        return (
          <div
            key={Math.random()}
            className={styles.ListValue}
            onClick={() => {
              setValue(listValue);
            }}
            style={isSelected ? { backgroundColor: "rgb(210,210,210)" } : {}}
            ref={isSelected ? listTargetRef : undefined}
          >
            {listValue}
            {isSelected && <FaCheck className={styles.CheckIcon} size={10} />}
          </div>
        );
      })}
    </div>
  );
});
