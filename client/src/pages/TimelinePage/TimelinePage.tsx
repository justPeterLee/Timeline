import { Outlet, useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
import { CreateTimeline } from "../../components/Timelines/CreateTimeline/CreateTimeline";
// import { CreateTimeline as CreateTimePole } from "../../components/timeline/timeline_components/TimelineComponents";
// import { useDispatc } from "react-redux";
// import { TimePoleDisplay } from "../../components/timepole/Timepole";
import {
  // useAppDispatch,
  useAppSelector,
} from "../../redux/redux-hooks/redux.hook";
import { useEffect } from "react";
import { TimeSpringContext } from "../../components/Timelines/Context/TimelineContext";
// import { TimePoleDisplay } from "../../components/timepole/Timepole";

import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";
export default function TimelinePage() {
  const { month, mode } = useParams();
  // const location
  const timepole = useAppSelector((store) => store.timepole.getTimePole);
  // const dispatch = useAppDispatch();

  useEffect(() => {
    // console.log(timepole);
  }, [timepole]);

  return (
    <>
      <TimeSpringContext>
        <Outlet />

        {/* <DisplayTimeline poles={timepole} /> */}
        {mode === "create" ? <CreateTimeline /> : <ViewTimeline />}
        {/* <CreateTimePole /> */}

        <ViewLinks page={month ? "month" : "year"} />
      </TimeSpringContext>
    </>
  );
}
