import styles from "./Timeline.module.css";
import { ReactNode } from "react";

import { TimelineSVG } from "./timeline_components/TimelineComponents";

export default function TimelineCard({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <TimelineSVG />
      {children}
    </div>
  );
}
