// import { createContext } from "vm";
import styles from "./TimelineBox.module.css";
import { ReactNode, useState, createContext } from "react";
// import
function TimelineBox(props: {
  children: ReactNode;
  id: "view" | "link" | "data";
}) {
  return (
    <div className={styles.timelineBoxContainer} id={props.id}>
      {props.children}
    </div>
  );
}
export const VisualBoxContext = createContext<
  | {
      url: string;
      func: { updateUrl: (newUrl: string) => void };
    }
  | undefined
>(undefined);
// const LinkBoxContext = createContext<any>({});
// const DataBoxContext = createContext<any>({ data: "" });

// animation
export function VisualBox(props: { children: ReactNode; url: string }) {
  const [urlState, setUrlState] = useState(props.url);

  const updateUrl = (newUrl: string) => {
    setUrlState(newUrl);
  };

  // console.log(props.url);
  return (
    <VisualBoxContext.Provider value={{ url: urlState, func: { updateUrl } }}>
      <TimelineBox id="view">{props.children}</TimelineBox>
    </VisualBoxContext.Provider>
  );
}

// link
export function LinkBox(props: { children: ReactNode }) {
  return (
    // <LinkBoxContext.Provider value={{}}>
    <TimelineBox id="link">{props.children}</TimelineBox>
    // </LinkBoxContext.Provider>
  );
}

// data
export function DataBox(props: { children: ReactNode; data: any }) {
  return (
    // <DataBoxContext.Provider value={{}}>
    <TimelineBox id="data">{props.children}</TimelineBox>
    // </DataBoxContext.Provider>
  );
}
