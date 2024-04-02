import { useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
import { CreateTimeline } from "../../components/Timelines/CreateTimeline/CreateTimeline";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { useMemo } from "react";
import { TimeSpringContext } from "../../components/Timelines/Context/TimelineContext";
import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";

export default function TimelinePage() {
  const { month, mode } = useParams();
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  const filterPoles = useMemo(() => {
    if (!month) {
      return poles;
    }

    return poles.filter((_pole: StandardPoleData) => {
      const poleDate = new Date(_pole.full_date);
      return poleDate.getMonth() + 1 == parseInt(month!);
    });
  }, [poles, month]);

  return (
    <>
      <TimeSpringContext>
        <ViewLinks page={month ? "month" : "year"} />
        {mode === "create" ? (
          <CreateTimeline poles={filterPoles} />
        ) : (
          <>
            {poles[0] !== "loading" && (
              <DisplayTimeline poles={poles} showPoles={filterPoles} />
            )}
            <ViewTimeline />
          </>
        )}
      </TimeSpringContext>
    </>
  );
}
