import styles from "./Timepole.module.css";

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
