import styles from "./modals.module.css";
// timepole edit
import { Modal, ValidInput } from "../elements/Links";
import format from "date-fns/format";
import { BsTextCenter, BsCalendar3, BsTrash3 } from "react-icons/bs";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";

export function TimePoleModal({
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
      timelineId: timePoleData.year_id,
    };

    if (user.id) {
      dispatch({ type: "UPDATE_TIME_POLE_SERVER", payload: newTimePole });
    } else {
      console.log("not logged in");
      const guestPayload = {
        id: timePoleData.id,
        year_id: timePoleData.year_id,

        title: newTimePoleData.title,
        description: newTimePoleData.description,

        date: newDate.getDate(),
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
        full_date: newDate.toISOString(),
      };
      dispatch({ type: "UPDATE_TIMEPOLE_GUEST", payload: guestPayload });
    }
    onClose();
  };

  // ----- event listener actions -------
  const onMarkComplete = () => {
    if (user) {
      dispatch({
        type: "UPDATE_COMPLETED_TIME_POLE_SERVER",
        payload: { pole: timePoleData, state: !timePoleData.completed },
      });
    } else {
      console.log("not logged in");
    }
    onClose();
  };

  const onDelete = () => {
    if (user.id) {
      dispatch({
        type: "DELETE_TIME_POLE_SERVER",
        payload: timePoleData,
      });
    } else {
      dispatch({
        type: "DELETE_TIMEPOLE_GUEST",
        payload: { id: timePoleData.id, timelineId: timePoleData.year_id },
      });
    }

    // deleteSortData({ id: timePoleData.id });
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
              value={newTimePoleData.description}
              onChange={(e) => {
                setNewTimePoleData({
                  ...newTimePoleData,
                  description: e.currentTarget.value,
                });
              }}
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
                {new Date(timePoleData.full_date).getFullYear()}
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

// group timepole

export function GroupTimePoleSelectionModal({
  timePoleDataArr,
  setSelectedPole,
  onClose,
}: {
  timePoleDataArr: StandardPoleData[];
  setSelectedPole: (id: StandardPoleData) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className={styles.GroupPoleModalContainer}>
        {timePoleDataArr.map((_pole) => {
          return (
            <GroupPole
              key={_pole.id}
              pole={_pole}
              setSelectedPole={setSelectedPole}
            />
          );
        })}
      </div>
    </Modal>
  );
}

function GroupPole({
  pole,
  setSelectedPole,
}: {
  pole: StandardPoleData;
  setSelectedPole: (id: StandardPoleData) => void;
}) {
  return (
    <div
      className={styles.GroupPoleContainer}
      onClick={() => {
        setSelectedPole(pole);
      }}
    >
      {pole.title}
    </div>
  );
}

// timepole confirmation
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

// create timepole
interface TimepoleType {
  title: string;
  description: string;
  date: Date | null;
}
import { Timepole } from "../timepole/Timepole";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";

export function CreatePoleModal({
  xPercent,
  date,
  onClose,
}: {
  xPercent: number;
  date: Date | null;
  onClose: () => void;
}) {
  // dependencies
  const { year, month } = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.userAccount);
  // ------- time pole values -------
  const [value, setValue] = useState<TimepoleType>({
    title: "",
    description: "",
    date: date,
  });

  const [isError, setIsError] = useState(false);

  const validateTimePole = () => {
    if (!value.title.replace(/\s/g, "")) {
      setIsError(true);
      return true;
    } else {
      setIsError(false);
    }
    return false;
  };
  const postTimepole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateTimePole()) {
      throw `error`;
    }

    if (!date) {
      throw "invalid date";
    }

    const date_data = {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      day: date.getDay(),
      full_date: date.toISOString(),
    };

    if (user) {
      console.log("user is found");
      dispatch({
        type: "CREATE_TIMEPOLE_SERVER",
        payload: {
          title: value.title,
          description: value.description,
          date_data,
        },
      });
    } else {
      console.log("create on local storage");
    }
    onClose();
    const viewUrl = month
      ? `/month/${year}/${month}/view`
      : `/year/${year}/view`;
    navigate(viewUrl);
  };
  // ------- date picker --------
  const [selectedDate, setSelectedDate] = useState(date);

  const dateSelector = (e: Date) => {
    setValue({ ...value, date: e });
    setSelectedDate(e);
  };

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    { value: any; onClick: any }
  >(({ value, onClick }, ref) => (
    <input
      className={styles.datePickerInput}
      onClick={onClick}
      value={value}
      type="button"
      ref={ref}
    />
  ));

  // ------- inital setup --------

  useEffect(() => {
    setValue({ ...value, date: date });
    if (date) setSelectedDate(date);
  }, [date]);

  useEffect(() => {
    // console.log("updated user");
    dispatch({ type: "FETCH_USER" });
  }, []);
  if (!date) {
    return <></>;
  }

  return (
    <>
      <div
        className={styles.poleModalContainer}
        style={{
          transform: `translateX(${xPercent}%)`,
          display: date ? "flex" : "none",
          // opacity: date ? "100%" : "0%",
        }}
      >
        <form
          className={styles.inputContainer}
          onSubmit={(e) => postTimepole(e)}
        >
          <ValidInput
            label="title"
            // errorLabel="invalid title"
            error={{
              label: "invalid title",
              state: isError,
            }}
            setValue={(newValue) => {
              setValue({ ...value, title: newValue });
            }}
            value={value.title}
          />
          <ValidInput
            label="description"
            placeholder="(optional)"
            setValue={(newValue) => {
              setValue({ ...value, description: newValue });
            }}
            value={value.description}
          />

          <DatePicker
            selected={selectedDate}
            onChange={(e: Date) => {
              dateSelector(e);
            }}
            customInput={<CustomInput value={undefined} onClick={undefined} />}
            dateFormat="EEEE, LLLL d"
            minDate={new Date("2024-01-01")}
            maxDate={new Date("2024-12-31")}
          />

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              id={styles.createButton}
              type="submit"
            >
              create
            </button>
          </div>
        </form>
        <Timepole style={{ backgroundColor: "rgb(100,100,100)" }} />
      </div>
    </>
  );
}
