import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getPoleDataList } from "../../tools/data";
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
  const poleDatas = getPoleDataList(poles, urlView);

  const yPosRef = useRef(0);

  const [selectedPole, setSelectedPole] = useState<null | Pole>(null);

  const onClose = () => {
    setSelectedPole(null);
  };

  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
    yPosRef.current = 200;
  }, [dispatch]);

  return (
    <>
      <div className={styles.timePoleDisplayContainer}>
        {Object.keys(poleDatas).map((_key, index) => {
          return (
            <Fragment key={index}>
              {poleDatas[_key].polesList.map(
                (_pole: { pole: Pole; xPercent: number }) => {
                  const isGroup =
                    poleDatas[_key].polesList.length >= 3 ? true : false;

                  // if (isGroup) console.log(_pole);

                  return (
                    <TimepoleMarker
                      key={_pole.pole.id}
                      xPercent={
                        isGroup ? poleDatas[_key].midPoint : _pole.xPercent
                      }
                      timePoleData={_pole.pole}
                      yPosRef={yPosRef.current}
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

import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
export function TimepoleMarker({
  xPercent,
  timePoleData,
  yPosRef,

  setSelectedPole,
}: {
  xPercent: number;
  timePoleData: Pole;
  yPosRef: number;
  setSelectedPole: (id: Pole) => void;
}) {
  const wasDragging = useRef(false);

  const yPos = useRef(yPosRef);
  const [{ y, height }, api] = useSpring(() => ({
    y: yPosRef,
    height: 0,
  }));

  const bind = useDrag(({ down, movement: [, my] }) => {
    if (!down) {
      yPos.current = my + yPos.current;
    }

    if (down) {
      if (!wasDragging.current && (my > 5 || my < -5)) {
        wasDragging.current = true;
      }
      api.start({ y: my + yPos.current, height: my + yPos.current });
    }

    // console.log(my);
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
          height,
          transform: "rotate(180deg)",
          // transform:
          transformOrigin: "top",
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        style={{ y, touchAction: "pan-y" }}
        className={styles.textContainer}
      >
        {timePoleData.id}
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
    <button
      onClick={onClick}
      value={value}
      type="button"
      className={styles.modalDateButton}
    >
      {value}
    </button>
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
