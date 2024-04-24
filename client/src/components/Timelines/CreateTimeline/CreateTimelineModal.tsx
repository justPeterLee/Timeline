import styles from "./CreateTimeline.module.css";

import { ValidInput } from "../../elements/Elements";
import { Modal } from "../../modals/ModalComponents";
import { current } from "../../../tools/data/monthData";

import { LegacyRef, ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { BsCalendar3, BsTextCenter } from "react-icons/bs";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/redux-hooks/redux.hook";

import axios from "axios";
import * as React from "react";

export function CreateTimelineModal({
  date,
  onClose,
}: {
  date: Date;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { month, year } = useParams();
  const user = useAppSelector((store) => store.userAccount.userReducer);

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
      throw `error invalid input`;
    }

    if (!newTimePole.date) {
      throw "invalid date";
    }

    if (user.id) {
      const data: { data: { id: number }[] } = await axios.get(
        `/api/v1/timeline/get/id/${year ? year : current.year}`
      );

      const timelineId = data.data.length ? data.data[0].id : null;

      const payload = {
        title: newTimePole.title,
        description: newTimePole.description,
        date_data: {
          date: newTimePole.date.getDate(),
          month: newTimePole.date.getMonth(),
          year: newTimePole.date.getFullYear(),
          day: newTimePole.date.getDay(),
          full_date: newTimePole.date.toISOString(),
        },
        timelineId: timelineId,
      };

      dispatch({
        type: "CREATE_TIMEPOLE_SERVER",
        payload,
      });
    } else {
      const payload = {
        id: Math.random().toString(),
        year_id: newTimePole.date.getFullYear().toString(),

        title: newTimePole.title,
        description: newTimePole.description,
        completed: false,

        date: newTimePole.date.getDate(),
        month: newTimePole.date.getMonth(),
        year: newTimePole.date.getFullYear(),
        full_date: newTimePole.date.toISOString(),
      };

      dispatch({
        type: "CREATE_TIMEPOLE_GUEST",
        payload: payload,
      });
    }

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
            <div className={styles.ModalIconContainer}></div>
            <ValidInput
              label="title"
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
  >(({ value, onClick }: any, ref: LegacyRef<HTMLInputElement> | undefined) => (
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
        minDate={new Date(`${date.getFullYear()}-01-02`)}
        maxDate={new Date(`${date.getFullYear()}-12-31`)}
      />
    </>
  );
}
