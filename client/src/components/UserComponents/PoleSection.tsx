import { IoMdArrowDropdown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useAppDispatch } from "../../redux/redux-hooks/redux.hook";
import { TimelinePole } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./PoleSection.module.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { InvisibleBackdrop, Modal } from "../modals/ModalComponents";
import { current } from "../../tools/data/monthData";
// import {format}

export function PoleSectionContainer({
  poles,
}: {
  poles: {
    [timeline_Id: string]: {
      year: number;
      poles: { [month: string]: TimelinePole[] };
    };
  };
}) {
  const [createModal, setCreateModal] = useState(false);

  const polesKeys = useMemo(() => {
    return Object.keys(poles);
  }, [poles]);

  const yearsOwned = useMemo(() => {
    const yearObj: { [year: number]: number } = {};

    for (let i = 0; i < polesKeys.length; i++) {
      yearObj[poles[polesKeys[i]].year] = poles[polesKeys[i]].year;
    }

    return yearObj;
  }, [poles]);
  return (
    <>
      <div className={styles.PoleSectionContainer}>
        {polesKeys.map((_timelineId) => {
          const poleData = poles[_timelineId];
          return (
            <PoleSection
              key={_timelineId}
              poleDataObj={poleData.poles}
              year={poleData.year}
            />
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
            yearsOwned={yearsOwned}
            onClose={() => {
              setCreateModal(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}

import { RxDotsVertical } from "react-icons/rx";
import { BsTrash3 } from "react-icons/bs";
import { ConfirmationModal } from "../modals/MMM";

function PoleSection({
  poleDataObj,
  year,
}: {
  poleDataObj: { [key: string]: TimelinePole[] };
  year: string | number;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const monthArr = Object.keys(poleDataObj);

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleConfirmation, setToggleConfirmation] = useState(false);

  const deleteTimeline = () => {
    dispatch({ type: "DELETE_TIMELINE_SERVER", payload: { year } });
    setToggleMenu(false);
    setToggleConfirmation(false);
  };
  return (
    <div className={styles.PSBody}>
      <div className={styles.PSDeleteButtonContainer}>
        <button
          style={{
            backgroundColor: `${
              toggleMenu ? "rgb(230, 230, 230)" : "transparent"
            }`,
          }}
          className={styles.PSMenu}
          onClick={() => {
            setToggleMenu(true);
          }}
        >
          <RxDotsVertical size={16} />
        </button>

        {toggleMenu && (
          <>
            <button
              className={styles.PSDeleteButton}
              onClick={() => {
                setToggleConfirmation(true);
              }}
            >
              <BsTrash3 size={15} className={styles.deleteModalIcon} />
              delete
            </button>
            <InvisibleBackdrop
              onClose={() => {
                setToggleMenu(false);
              }}
            />
          </>
        )}

        {toggleConfirmation && (
          <Modal
            onClose={() => {
              setToggleMenu(false);
              setToggleConfirmation(false);
            }}
          >
            <ConfirmationModal
              onClose={() => {
                setToggleMenu(false);
                setToggleConfirmation(false);
              }}
              onAction={deleteTimeline}
            />
          </Modal>
        )}
      </div>
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
            return <MonthSection key={_poleMonth} poleDataArr={poleDataArr} />;
          })}
        </div>
      </div>
    </div>
  );
}

function MonthSection({ poleDataArr }: { poleDataArr: TimelinePole[] }) {
  return (
    <div className={styles.MonthSection}>
      <div className={styles.MonthSectionContainer}>
        {poleDataArr.map((_pole) => (
          <Section key={_pole.pole_id} poleData={_pole} />
        ))}
      </div>
    </div>
  );
}

function Section({ poleData }: { poleData: TimelinePole }) {
  return (
    <div className={styles.Section}>
      <p style={{ fontSize: "12px" }}>
        {format(new Date(poleData.full_date), "MMM io")}
      </p>
      <p>{poleData.pole_title}</p>
    </div>
  );
}

function CreateNewYearModal({
  yearsOwned,
  onClose,
}: {
  yearsOwned: { [year: number]: number };
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const dataListTargetRef = useRef<null | HTMLDivElement>(null);
  const listTargetRef = useRef<{ scollIntoView: () => void } | null>(null);

  const [selectedYear, setSelectedYear] = useState(current.year);
  const [focus, setFocus] = useState(false);

  const dispatch = useAppDispatch();

  const createTimeline = () => {
    const dataPayload = { title: "", year: selectedYear };

    // only create new timeline if not already created
    if (!yearsOwned[selectedYear]) {
      dispatch({ type: "POST_TIMELINE_SERVER", payload: dataPayload });
    }
    navigate(`/year/${selectedYear}/view`);
  };
  useEffect(() => {
    if (focus && listTargetRef.current) {
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
