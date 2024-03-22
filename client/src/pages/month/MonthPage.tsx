import "./MonthPage.css";
import TimelineCard from "../../components/timeline/Timeline";
import TimelineMonthPage from "../../components/timeline/TimelineMonth/TimelineMonth";
import { GlobalLinks } from "../../components/elements/Links";

export default function MonthPage() {
  return (
    <>
      <TimelineCard children={<TimelineMonthPage />} />
    </>
  );
}
