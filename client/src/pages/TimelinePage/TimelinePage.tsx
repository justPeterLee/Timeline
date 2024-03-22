import { Outlet, useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
export default function TimelinePage() {
  const { month } = useParams();

  return (
    <>
      <Outlet />
      <ViewLinks page={month ? "month" : "year"} />
    </>
  );
}
