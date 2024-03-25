import { Outlet, useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
import { CreateTimeline } from "../../components/Timelines/CreateTimeline/CreateTimeline";
// import { CreateTimeline as CreateTimePole } from "../../components/timeline/timeline_components/TimelineComponents";

// import { TimePoleDisplay } from "../../components/timepole/Timepole";
export default function TimelinePage() {
  const { month, mode } = useParams();

  return (
    <>
      <Outlet />

      {mode === "create" ? <CreateTimeline /> : <ViewTimeline />}
      {/* <CreateTimePole /> */}
      <ViewLinks page={month ? "month" : "year"} />
    </>
  );
}
