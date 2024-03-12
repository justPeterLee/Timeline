// import { createContext } from "vm";
import styles from "../Timeline.module.css";
import { ReactNode, useState, createContext } from "react";
// import
function TimelineBox(props: { children: ReactNode }) {
  return <div className={styles.timelineBoxContainer}>{props.children}</div>;
}
const VisualBoxContext = createContext<any>({ url: "" });
// const LinkBoxContext = createContext<any>({});
// const DataBoxContext = createContext<any>({ data: "" });

// animation
export function VisualBox(props: { children: ReactNode; url: string }) {
  const [urlState, setUrlState] = useState(props.url);

  return (
    <VisualBoxContext.Provider value={{ url: urlState }}>
      <TimelineBox>{props.children}</TimelineBox>
    </VisualBoxContext.Provider>
  );
}

// link
export function LinkBox(props: { children: ReactNode }) {
  return (
    // <LinkBoxContext.Provider value={{}}>
    <TimelineBox>{props.children}</TimelineBox>
    // </LinkBoxContext.Provider>
  );
}

// data
export function DataBox(props: { children: ReactNode; data: any }) {
  return (
    // <DataBoxContext.Provider value={{}}>
    <TimelineBox>{props.children}</TimelineBox>
    // </DataBoxContext.Provider>
  );
}
