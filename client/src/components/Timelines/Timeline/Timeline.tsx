import { ReactNode } from "react";
import styles from "./Timeline.module.css";

export function TimelineCard({
  children,
  id = "timeline",
  style = {},
}: {
  children: ReactNode;
  id: string;
  style: {};
}) {
  return (
    <div className={styles.TimelineCard} id={id} style={{ ...style }}>
      {children}
    </div>
  );
}
