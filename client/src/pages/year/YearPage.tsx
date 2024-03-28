// import { LinktTimelineYear } from "../../components/Timelines/LinkTimeline/LinkTimelineYear";
// import TimelineCard from "../../components/timeline/Timeline";
// import TimelineYearPage from "../../components/timeline/TimelineYear/TimelineYear";
// import { useParams } from "react-router-dom";
import "../../App.css";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { useEffect } from "react";
import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";

function YearPage() {
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  useEffect(() => {
    console.log(poles);
  }, [poles]);

  if (poles[0] === "loading") return <></>;
  return (
    <div className="Page">
      {/* <LinktTimelineYear /> */}
      {/* <DisplayTimeline poles={poles} /> */}
    </div>
  );
}

export default YearPage;
