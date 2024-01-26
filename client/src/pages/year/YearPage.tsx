import "./App.css";
import TimelineCard from "../../components/timeline/Timeline";
import TimelineYearPage from "../../components/timeline/TimelineYear/TimelineYear";
import { GlobalLinks } from "../../components/elements/Links";
function YearPage() {
  return (
    <>
      <TimelineCard children={<TimelineYearPage />} />
      <GlobalLinks page="year" />
    </>
  );
}

export default YearPage;
