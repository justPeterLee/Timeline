import styles from "./Timepole.module.css";
import { useEffect, Fragment, useRef, useState, useMemo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

import { getPoleDataList } from "../../tools/data";
import {
  sort,
  insertSorData,
  compareSortPoles,
} from "../../tools/utilities/timepoleUtils/timepole";

import {
  PoleCordsData,
  PoleDatas,
  StandardPoleData,
} from "../../tools/utilities/timepoleUtils/timepoleUtils";

export function TimePoleDisplay({
  url,
  poles,
}: {
  url: string | undefined;
  poles: any[];
}) {
  const urlView = url ? url : "year";

  const poleDatas: PoleDatas = useMemo(() => {
    return getPoleDataList(poles, urlView);
  }, [poles, urlView]);

  const [sortData, setSortData] = useState<any>({});
  const [pageRender, setPageRender] = useState(false);

  const [selectedPole, setSelectedPole] = useState<null | StandardPoleData>(
    null
  );

  const onClose = () => {
    setSelectedPole(null);
  };

  const updateWindowSort = (data: string) => {
    window.localStorage.setItem("sortDataEffect", data);
  };

  const updateSortData = (_pole: { id: string; yPos: number }) => {
    const proxyLocalData = sortData;
    proxyLocalData[_pole.id] = { yPos: _pole.yPos };

    const jsonSortData = JSON.stringify(proxyLocalData);
    updateWindowSort(jsonSortData);
  };

  useEffect(() => {
    //check if sort data already exist
    const localStorageData = window.localStorage.getItem("sortDataEffect");
    if (localStorageData && localStorageData !== undefined) {
      const jsonLocalStorageData: PoleCordsData = JSON.parse(localStorageData);
      const addPoles = compareSortPoles(poles, jsonLocalStorageData);

      if (addPoles.length) {
        console.log(addPoles);
        const newSortData = insertSorData(
          poles,
          addPoles,
          jsonLocalStorageData
        );
        const jsonSortData = JSON.stringify(newSortData);
        updateWindowSort(jsonSortData);
      }
      setSortData(jsonLocalStorageData);
    } else {
      // create sort data
      // check if data is generated
      if (!Object.keys(poleDatas).length) {
        console.log("invalid poles data: ", poles);
        return;
      }

      // if data is done generated
      const newSortData = sort(poleDatas);
      const jsonSortData = JSON.stringify(newSortData);
      updateWindowSort(jsonSortData);
      setSortData(JSON.parse(window.localStorage.getItem("sortDataEffect")!));
    }
  }, [poles, poleDatas, window.localStorage.getItem("sortDataEffect")]);

  useEffect(() => {
    setPageRender(true);
  }, []);

  return (
    <>
      <div className={styles.timePoleDisplayContainer} id={"asdf"}>
        {Object.keys(poleDatas).map((_week, index) => {
          return (
            <Fragment key={index}>
              {poleDatas[_week].polesList.map((_pole) => {
                const isGroup =
                  poleDatas[_week].polesList.length >= 3 ? true : false;

                // if (isGroup) console.log(_pole);

                return (
                  <TimepoleMarker
                    key={_pole.pole.id}
                    xPercent={
                      isGroup ? poleDatas[_week].midPoint : _pole.xPercent
                    }
                    timePoleData={_pole.pole}
                    yPos={sortData[_pole.pole.id]}
                    setSelectedPole={(id) => {
                      setSelectedPole(id);
                    }}
                    updateSortData={(_pole: { id: string; yPos: number }) => {
                      updateSortData(_pole);
                    }}
                    pageRender={pageRender}
                  />
                );
              })}
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
import { useDrag } from "@use-gesture/react";
import { Modal } from "../elements/Links";
export function TimepoleMarker({
  xPercent,
  timePoleData,
  yPos,
  pageRender,

  setSelectedPole,
  updateSortData,
}: {
  xPercent: number;
  timePoleData: StandardPoleData;
  yPos: { yPos: number };
  pageRender: boolean;

  setSelectedPole: (id: StandardPoleData) => void;
  updateSortData: (_pole: { id: string; yPos: number }) => void;
}) {
  const wasDragging = useRef(false);
  const yPosRef = useRef(yPos ? yPos.yPos : 100);
  const targetElement = useRef<HTMLDivElement>(null);

  const yPosMemo = useMemo(() => {
    yPosRef.current = yPos ? yPos.yPos : -100;
    return yPos ? yPos.yPos : -100;
  }, [yPos]);

  const [{ x, y, scale }, api] = useSpring(() => ({
    y: 0,
    x: 0,
    scale: 0,
  }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (!down) {
      // updator
      yPosRef.current = my + yPosRef.current;

      if (targetElement.current) {
        //middle point
        const boundClient = targetElement.current.getBoundingClientRect();
        const middlePoint = boundClient.height / 2;
        const targetPos = boundClient.top + middlePoint;

        // bounds
        const windowHalf = window.innerHeight / 2;
        const heavenWindow = windowHalf - 50;
        const hellWindow = windowHalf + 50;

        //condition
        if (targetPos > heavenWindow && targetPos < hellWindow) {
          if (targetPos > heavenWindow && targetPos < windowHalf) {
            yPosRef.current = -80;
            api.start({ y: yPosRef.current, scale: yPosRef.current + 40 });
          } else {
            yPosRef.current = 40;
            api.start({ y: yPosRef.current, scale: yPosRef.current });
          }
        }
      } else {
        const middleOffset = 15.5 + 5;
        const targetPos = yPosRef.current + middleOffset + my;
        console.log(targetPos);
        if (targetPos > -40 && targetPos < 40) {
          if (targetPos > -40 && targetPos < 0) {
            yPosRef.current = -80;
            api.start({ y: yPosRef.current, scale: yPosRef.current + 40 });
          } else {
            yPosRef.current = 40;
            api.start({ y: yPosRef.current, scale: yPosRef.current });
          }
        }
      }

      updateSortData({ id: timePoleData.id, yPos: yPosRef.current });
    }

    if (down) {
      if (!wasDragging.current && (my > 5 || my < -5)) {
        wasDragging.current = true;
      }
      const offsetYPos = my + yPosRef.current;
      api.start({
        y: offsetYPos,
        scale: offsetYPos > 0 ? offsetYPos : offsetYPos + 40,
      });
    }

    api.start({ x: down ? mx : 0 });
  });

  useEffect(() => {
    // if()
    api.start({
      from: { y: yPosMemo > 0 ? 25 : -25, scale: yPosMemo > 0 ? 25 : -25 },
      to: { y: yPosMemo, scale: yPosMemo > 0 ? yPosMemo : yPosMemo + 40 },
    });
  }, [pageRender, yPosMemo]);

  // if (!yPos) return <></>;

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
      <animated.div
        className={styles.animatedTimePole}
        style={{
          transform: interpolate([scale], (s: number) => {
            return `scaleY(${s})`;
          }),
          transformOrigin: "top",
        }}
      ></animated.div>

      <animated.div
        {...bind()}
        style={{ x, y, touchAction: "pan-y" }}
        className={styles.textContainer}
        id={`pole-${timePoleData.id}`}
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

import { ValidInput } from "../elements/Links";
import format from "date-fns/format";
import { BsTextCenter, BsCalendar3, BsTrash3 } from "react-icons/bs";
import DatePicker from "react-datepicker";
import React from "react";

function TimePoleModal({
  timePoleData,
  onClose,
}: {
  timePoleData: StandardPoleData;
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
