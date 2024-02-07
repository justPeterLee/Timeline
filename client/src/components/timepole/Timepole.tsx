import styles from "./Timepole.module.css";
import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";
export function TimePoleDisplay() {
  const dispatch = useAppDispatch();

  const poles = useAppSelector((store) => store.timepole.getTimePole);

  useEffect(() => {
    dispatch({ type: "GET_TIMEPOLE_SERVER" });
  }, []);
  return (
    <div className={styles.timePoleDisplayContainer}>
      <></>
    </div>
  );
}

export function TimepoleMarker() {
  return (
    <div className={styles.container}>
      <Timepole />
      <div className={styles.textContainer}></div>
    </div>
  );
}

export function Timepole({ height }: { height?: string }) {
  return (
    <div
      className={styles.timepole}
      style={{ height: height ? height : "" }}
    ></div>
  );
}
