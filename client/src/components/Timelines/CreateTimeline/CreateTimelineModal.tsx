import styles from "./CreateTimeline.module.css";
import { ValidInput } from "../../elements/Links";
import { Modal } from "../../elements/Links";

import { ReactNode, useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import React from "react";
import { BsCalendar3, BsTextCenter } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../redux/redux-hooks/redux.hook";
import axios from "axios";
import { current } from "../../../tools/data/monthData";

export function CreateTimelineModal({
  date,
  onClose,
}: {
  date: Date;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { month, year } = useParams();
  const dispatch = useAppDispatch();

  const [newTimePole, setNewTimepole] = useState({
    title: "",
    date: date,
    description: "",
  });

  const [isError, setIsError] = useState(false);

  const validateTimePole = () => {
    if (!newTimePole.title.replace(/\s/g, "")) {
      setIsError(true);
      return true;
    } else {
      setIsError(false);
    }
    return false;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateTimePole()) {
      throw `error`;
    }

    if (!date) {
      throw "invalid date";
    }

    const data: { data: { id: number }[] } = await axios.get(
      `/api/v1/timeline/get/${year ? year : current.year}`
    );

    const timelineId = data.data.length ? data.data[0].id : null;

    const payload = {
      title: newTimePole.title,
      description: newTimePole.description,
      date_data: {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        day: date.getDay(),
        full_date: date.toISOString(),
      },
      timelineId: timelineId,
    };

    dispatch({
      type: "CREATE_TIMEPOLE_SERVER",
      payload,
    });

    onClose();

    navigate(month ? `/month/${year}/${month}/view` : `/year/${year}/view`);
  };
  return (
    <Modal onClose={onClose} backdropStyle={{ backgroundColor: "transparent" }}>
      <form
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <div className={styles.CreateTimelineModal}>
          <div className={styles.ModalTitle}>
            {/* <div className={styles.IconContainer}></div> */}
            <div className={styles.ModalIconContainer}>
              {/* <BsCalendar3 className={styles.modalIcon} /> */}
            </div>
            <ValidInput
              label="title"
              // errorLabel="invalid title"
              error={{
                label: "invalid title",
                state: isError,
              }}
              setValue={(newTitle) => {
                setNewTimepole({ ...newTimePole, title: newTitle });
              }}
              value={newTimePole.title}
              inputStyle={{ width: "20rem", fontSize: "24px" }}
            />
          </div>

          <div className={styles.ModalDate}>
            <div className={styles.ModalIconContainer}>
              <BsCalendar3 className={styles.modalIcon} />
            </div>

            <DatePickerModal
              date={date}
              setValue={(date) => {
                setNewTimepole({ ...newTimePole, date: date });
              }}
            />
          </div>

          <div className={styles.ModalDesc}>
            <div className={styles.ModalIconContainer}>
              <BsTextCenter className={styles.modalIcon} />
            </div>

            <textarea
              className={styles.modalTextarea}
              placeholder="add description"
              value={newTimePole.description}
              onChange={(e) => {
                setNewTimepole({ ...newTimePole, description: e.target.value });
              }}
            />
          </div>

          <div className={styles.ModalActionButton}>
            <button>save</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export function DatePickerModal({
  date,
  children,
  setValue,
}: {
  date: Date;
  children?: ReactNode;
  setValue: (date: Date) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(date);

  const dateSelector = (e: Date) => {
    setSelectedDate(e);
    setValue(e);
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
      id="date-picker-modal"
      ref={ref}
    ></input>
  ));

  useEffect(() => {
    //   console.log(date);
    setSelectedDate(date);
  }, [date]);
  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={(e: Date) => {
          dateSelector(e);
        }}
        customInput={
          children ? (
            children
          ) : (
            <CustomInput value={undefined} onClick={undefined} />
          )
        }
        dateFormat="EEEE, LLLL d"
        minDate={new Date("2024-01-01")}
        maxDate={new Date("2024-12-31")}
      />
    </>
  );
}
