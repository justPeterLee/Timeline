import { Outlet, useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
import { CreateTimeline } from "../../components/Timelines/CreateTimeline/CreateTimeline";
export default function TimelinePage() {
  const { month, mode } = useParams();

  return (
    <>
      <Outlet />

      {mode === "create" ? <ViewTimeline /> : <CreateTimeline />}
      <ViewLinks page={month ? "month" : "year"} />
    </>
  );
}
