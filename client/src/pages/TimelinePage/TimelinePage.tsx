import { Outlet, useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
export default function TimelinePage() {
  const { month } = useParams();

  return (
    <>
      <Outlet />

      <ViewTimeline />
      <ViewLinks page={month ? "month" : "year"} />
    </>
  );
}
