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
        <Modal onClose={onClose}>
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

function TimePoleModal({
  timePoleData,
  onClose,
}: {
  timePoleData: Pole;
  onClose: () => void;
}) {
  const [newTimePoleData, setNewTimePoleData] = useState({
    title: timePoleData.title,
    description: timePoleData.description,
    date: timePoleData.full_date,
    completed: timePoleData.completed,
  });

  const [editMode, setEditMode] = useState(false);

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <>
      {editMode ? (
        <form onSubmit={(e) => onSubmitForm(e)}>
          <ValidInput
            value={newTimePoleData.title}
            setValue={(newTitle) => {
              setNewTimePoleData({ ...newTimePoleData, title: newTitle });
            }}
            label="title"
            error={{ custom: true }}
            inputStyle={{ width: "100%" }}
          />
          <button onClick={onClose} type="button">
            save
          </button>
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
            <BsCalendar3 />
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
              <BsTextCenter />
              <div className={styles.modalDescription}>
                <p>{timePoleData.description}</p>
              </div>
              {/* <p className={styles.modalTitleView}>description</p> */}
            </div>
          )}

          <div className={styles.modalButtonContainer}>
            <div>
              <button className={styles.completeModal}>mark complete</button>
            </div>
            <div className={styles.modalActionButton}>
              <button className={styles.modalButton} id={styles.deleteModal}>
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
    </>
  );
}
