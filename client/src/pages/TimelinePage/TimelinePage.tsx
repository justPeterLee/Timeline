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
import { useEffect, useMemo } from "react";
import { TimeSpringContext } from "../../components/Timelines/Context/TimelineContext";
// import { TimePoleDisplay } from "../../components/timepole/Timepole";

import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
export default function TimelinePage() {
  const { month, mode } = useParams();
  // const location
  const poles = useAppSelector((store) => store.timepole.getTimePole);
  // const dispatch = useAppDispatch();

  const filterPoles = useMemo(() => {
    if (!month) {
      return poles;
    }

    return poles.filter((_pole: StandardPoleData) => {
      const poleDate = new Date(_pole.full_date);
      return poleDate.getMonth() + 1 == parseInt(month!);
    });
  }, [poles]);

  useEffect(() => {
    // console.log(timepole);
  }, [poles]);

  return (
    <>
      <TimeSpringContext>
        <Outlet />

        {/* <DisplayTimeline poles={timepole} /> */}

        {poles[0] !== "loading" && (
          <DisplayTimeline poles={poles} showPoles={filterPoles} />
        )}

        {mode === "create" ? <CreateTimeline /> : <ViewTimeline />}

        {/* <CreateTimePole /> */}

        <ViewLinks page={month ? "month" : "year"} />
      </TimeSpringContext>
    </>
  );
}
