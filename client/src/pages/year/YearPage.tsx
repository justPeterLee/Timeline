import "./App.css";
import TimelineCard from "../../components/timeline/Timeline";
import TimelineYearPage from "../../components/timeline/TimelineYear/TimelineYear";
function YearPage() {
  return (
    <>
      <TimelineCard children={<TimelineYearPage />} />
    </>
  );
}

export default YearPage;
