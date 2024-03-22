import { Outlet, useParams } from "react-router-dom";
import { GlobalLinks } from "../../components/elements/Links";
export default function TimelinePage() {
  const { month } = useParams();

  return (
    <>
      <Outlet />
      <GlobalLinks page={month ? "month" : "year"} />
    </>
  );
}
