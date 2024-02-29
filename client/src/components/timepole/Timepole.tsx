import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef, useState, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getPoleDataList } from "../../tools/data";
import { sort } from "../../tools/utilities/timepoleUtils/timepole";

import { PoleCordsData } from "../../tools/utilities/timepoleUtils/timepoleUtils";

interface Pole {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  date: number;
  month: number;
  year: number;
  day: number;
  full_date: string;
}

export function TimePoleDisplay({ url }: { url: string | undefined }) {
  const dispatch = useAppDispatch();
  const poles = useAppSelector((store) => store.timepole.getTimePole);
  const urlView = url ? url : "year";

  const poleDatas = useMemo(() => {
    return getPoleDataList(poles, urlView);
  }, [poles, urlView]);

  const [sortData, setSortDataEffect] = useState<PoleCordsData>({});
  const [selectedPole, setSelectedPole] = useState<null | Pole>(null);

  const onClose = () => {
    setSelectedPole(null);
  };

  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, [dispatch]);

  useEffect(() => {
    //check if sort data already exist
    if (window.localStorage.getItem("sortDataEffect")) {
      const jsonSortData = JSON.parse(
        window.localStorage.getItem("sortDataEffect")!
      );
      setSortDataEffect(jsonSortData);
    } else {
      // create sort data

      // check if data is generated
      if (!Object.keys(poleDatas).length) {
        console.log("invalid poles data: ", poles);
        return;
      }

      // if data is done generated
      const newSortData = sort(poleDatas);

      // if newSortData is valid
      if (newSortData) {
        window.localStorage.setItem(
          "sortDataEffect",
          JSON.stringify(newSortData)
        );
      }

      // if window.localStorage is valid
      if (window.localStorage.getItem("sortDataEffect")) {
        const jsonSortData = JSON.parse(
          window.localStorage.getItem("sortDataEffect")!
        );
        setSortDataEffect(jsonSortData);
      }
    }
  }, [poleDatas, window.localStorage.getItem("sortDataEffect")]);

  return (
    <>
      <div className={styles.timePoleDisplayContainer} id={"asdf"}>
        {Object.keys(poleDatas).map((_week, index) => {
          return (
            <Fragment key={index}>
              {poleDatas[_week].polesList.map(
                (_pole: { pole: Pole; xPercent: number }) => {
                  const isGroup =
                    poleDatas[_week].polesList.length >= 3 ? true : false;

                  // if (isGroup) console.log(_pole);
                  let sortYPos = sortData[_pole.pole.id]
                    ? sortData[_pole.pole.id].yPos
                    : 100;

                  return (
                    <TimepoleMarker
                      key={_pole.pole.id}
                      id={_pole.pole.id}
                      xPercent={
                        isGroup ? poleDatas[_week].midPoint : _pole.xPercent
                      }
                      timePoleData={_pole.pole}
                      yPos={sortYPos}
                      setSelectedPole={(id) => {
                        setSelectedPole(id);
                      }}
                    />
                  );
                }
              )}
            </Fragment>
          );
        })}
      </div>
      {selectedPole && (
        <Modal onClose={onClose} styles={{ minWidth: "20rem" }}>
          <TimePoleModal onClose={onClose} timePoleData={selectedPole} />
        </Modal>
      )}
    </>
  );
}

import { useSpring, animated, to as interpolate } from "react-spring";
// import{to} from ''
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
export function TimepoleMarker({
  id,
  xPercent,
  timePoleData,
  yPos,

  setSelectedPole,
}: {
  id: string | number;
  xPercent: number;
  timePoleData: Pole;
  yPos: number;
  setSelectedPole: (id: Pole) => void;
}) {
  const wasDragging = useRef(false);

  const yPosRef = useRef(yPos);

  const targetElement = useRef<HTMLDivElement>(null);

  const [{ x, y, scale }, api] = useSpring(() => ({
    y: yPos,
    x: 0,
    scale: yPos > 0 ? yPos : yPos + 40,
  }));

  api.set({ y: yPos, scale: yPos > 0 ? yPos : yPos + 40 });

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (!down) {
      yPosRef.current = my + yPosRef.current;
      if (
        (yPosRef.current <= 25 && yPosRef.current >= 0) ||
        (yPosRef.current >= -60 && yPosRef.current <= 0)
      ) {
        console.log("dropped near center");
      }
    }

    if (down) {
      if (!wasDragging.current && (my > 5 || my < -5)) {
        wasDragging.current = true;
      }
      api.start({
        y: my + yPosRef.current,
        scale:
          my + yPosRef.current > 0
            ? my + yPosRef.current
            : my + yPosRef.current + 40,
      });
    }

    api.start({ x: down ? mx : 0 });
  });

  return (
    <div
      className={styles.timePoleMarkerContainer}
      style={{ left: `${xPercent}%` }}
      onClick={() => {
        if (!wasDragging.current) {
          setSelectedPole(timePoleData);
        }
        wasDragging.current = false;
      }}
    >
      {/* {<AnimatedTimePole isMoving={isMoving} points={{ point1, point2 }} />} */}

      <animated.div
        className={styles.animatedTimePole}
        style={{
          // thrans,
          transform: interpolate([scale], (s: number) => {
            return `scaleY(${s})`;
          }),
          // transform: "rotate(180deg)",
          // transform:
          transformOrigin: "top",
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        style={{ x, y, touchAction: "pan-y" }}
        className={styles.textContainer}
        id={`pole-${id}`}
        ref={targetElement}
        onClick={(e) => {
          console.log(e.currentTarget.getBoundingClientRect());
          // console.log(window.innerHeight);
        }}
      >
        <p style={{ margin: 0, whiteSpace: "nowrap" }}>{timePoleData.title}</p>
      </animated.div>
    </div>
  );
}

export function Timepole() {
  return <div className={styles.timepole}></div>;
}

export function AnimatedTimePole() {
  return <animated.div className={styles.animatedTimePole}></animated.div>;
}

import { ValidInput } from "../elements/Links";
import format from "date-fns/format";
// import { CiTextAlignCenter } from "react-icons/ci";
import { BsTextCenter, BsCalendar3, BsTrash3 } from "react-icons/bs";
import DatePicker from "react-datepicker";
import React from "react";

function TimePoleModal({
  timePoleData,
  onClose,
}: {
  timePoleData: Pole;
  onClose: () => void;
}) {
  // ------------ redux -----------------------
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.userAccount);

  // ----------- inital data ------------------

  const [editMode, setEditMode] = useState(false);

  const [newTimePoleData, setNewTimePoleData] = useState({
    title: timePoleData.title,
    description: timePoleData.description,
    date: timePoleData.full_date,
    completed: timePoleData.completed,
  });

  // ------------- Date Picker ----------------
  const dateSelector = (newDate: Date) => {
    setNewTimePoleData({ ...newTimePoleData, date: newDate.toISOString() });
  };

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    { value: any; onClick: any }
  >(({ value, onClick }, ref) => (
    <input
      onClick={onClick}
      value={value}
      type="button"
      className={styles.modalDateButton}
      ref={ref}
    ></input>
  ));

  // -------------- submit --------------------

  const [isError, setIsError] = useState(false);

  const validateNewTimePole = () => {
    if (!newTimePoleData.title.replace(/\s/g, "")) {
      setIsError(true);
      return true;
    } else {
      setIsError(false);
    }
    return false;
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateNewTimePole()) throw "error with input values";

    if (!newTimePoleData.date) {
      throw "invalid date";
    }

    const newDate = new Date(newTimePoleData.date);

    const date_data = {
      date: newDate.getDate(),
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
      day: newDate.getDay(),
      full_date: newDate.toISOString(),
    };

    const newTimePole = {
      id: timePoleData.id,
      title: newTimePoleData.title,
      description: newTimePoleData.description,
      date_data,
    };

    if (user) {
      dispatch({ type: "UPDATE_TIME_POLE_SERVER", payload: newTimePole });
    } else {
      console.log("not logged in");
    }
    onClose();
  };

  // ----- event listener actions -------
  const onMarkComplete = () => {
    if (user) {
      dispatch({
        type: "UPDATE_COMPLETED_TIME_POLE_SERVER",
        payload: { id: timePoleData.id, state: !timePoleData.completed },
      });
    } else {
      console.log("not logged in");
    }
    onClose();
  };

  const onDelete = () => {
    if (user) {
      dispatch({
        type: "DELETE_TIME_POLE_SERVER",
        payload: timePoleData.id,
      });
    } else {
      console.log("not logged in");
    }
    onClose();
  };

  // ---------  confirmation ----------
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onConfirmDelete = () => {
    setConfirmDelete(true);
  };

  return (
    <>
      {editMode ? (
        <form
          onSubmit={(e) => onSubmitForm(e)}
          className={styles.modalContainer}
        >
          <ValidInput
            value={newTimePoleData.title}
            setValue={(newTitle) => {
              setNewTimePoleData({ ...newTimePoleData, title: newTitle });
            }}
            label="title"
            error={{
              label: "title cannot be empty",
              state: isError,
            }}
            inputStyle={{
              width: "100%",
              fontSize: "26px",
              color: "rgb(100,100,100)",
            }}
            placeholder="add title"
          />
          <div className={styles.modalEditDate}>
            <BsCalendar3 className={styles.modalIcon} />
            <DatePicker
              selected={new Date(newTimePoleData.date)}
              onChange={(e: Date) => {
                dateSelector(e);
              }}
              customInput={
                <CustomInput value={undefined} onClick={undefined} />
              }
              dateFormat="EEEE, LLLL d"
              minDate={new Date("2024-01-01")}
              maxDate={new Date("2024-12-31")}
            />
          </div>

          <div className={styles.modalEditDescription}>
            <BsTextCenter className={styles.modalIcon} />

            <textarea
              className={styles.modalTextarea}
              placeholder="add description"
            />
          </div>

          <div className={styles.saveButtonContainer}>
            <button>save</button>
          </div>
        </form>
      ) : (
        <div className={styles.modalContainer}>
          <div className={styles.modalTitleContainer}>
            <span className={styles.modalTitle}>
              <p>{timePoleData.title}</p>
            </span>
            {/* <p className={styles.modalTitleView}>title</p> */}
          </div>
          <div className={styles.modalDateContainer}>
            <BsCalendar3 className={styles.modalIcon} />
            <div className={styles.modalDate}>
              <p style={{ marginBottom: "0px" }}>
                {format(new Date(timePoleData.full_date), "EEEE, LLLL d")}
              </p>
              <p
                style={{
                  marginTop: "0px",
                  fontSize: "12px",
                  // fontWeight: "400",
                  color: "rgb(100,100,100)",
                }}
                className={styles.modalDateYear}
              >
                {timePoleData.year}
              </p>
            </div>
            {/* <p className={styles.modalTitleView}>date</p> */}
          </div>
          {timePoleData.description && (
            <div className={styles.modalDescriptionContainer}>
              <BsTextCenter className={styles.modalIcon} />
              <div className={styles.modalDescription}>
                <p>{timePoleData.description}</p>
              </div>
              {/* <p className={styles.modalTitleView}>description</p> */}
            </div>
          )}

          <div className={styles.modalButtonContainer}>
            <div>
              <button className={styles.completeModal} onClick={onMarkComplete}>
                {timePoleData.completed ? "mark uncompleted" : "mark completed"}
              </button>
            </div>
            <div className={styles.modalActionButton}>
              <button
                className={styles.modalButton}
                id={styles.deleteModal}
                onClick={onConfirmDelete}
              >
                <BsTrash3 size={15} className={styles.deleteModalIcon} />
              </button>

              <button
                id={styles.modalEdit}
                className={styles.modalButton}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                edit
              </button>

              <button
                id={styles.modalClose}
                className={styles.modalButton}
                onClick={() => {
                  onClose();
                }}
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <Modal
          onClose={() => {
            setConfirmDelete(false);
          }}
        >
          <ConfirmationModal
            onClose={() => {
              setConfirmDelete(false);
            }}
            onAction={onDelete}
          />
        </Modal>
      )}
    </>
  );
}

function ConfirmationModal(props: {
  onClose: () => void;
  onAction: () => void;
}) {
  return (
    <div className={styles.confirmationContainer}>
      <p style={{ margin: 0 }}>Are you sure you want to delete?</p>
      <div className={styles.confirmationButtonContainer}>
        <button onClick={props.onClose} className={styles.confirmationCancel}>
          cancel
        </button>
        <button onClick={props.onAction} className={styles.confirmationAction}>
          delete
        </button>
      </div>
    </div>
  );
}
