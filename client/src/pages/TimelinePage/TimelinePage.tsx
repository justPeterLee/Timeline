import { useParams } from "react-router-dom";
import { ViewLinks } from "../../components/elements/Links";
import ViewTimeline from "../../components/Timelines/ViewTimeline/ViewTimeline";
import { CreateTimeline } from "../../components/Timelines/CreateTimeline/CreateTimeline";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { useEffect, useMemo } from "react";
import { TimeSpringContext } from "../../components/Timelines/Context/TimelineContext";
import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import { YearNavigation } from "../../components/Timelines/TLComponents/TLComponents";
import { current } from "../../tools/data/monthData";
import { yearLoader } from "../../tools/loaders/loader";

export default function TimelinePage() {
  const { year, month, mode } = useParams();
  const currentPoles = useAppSelector(
    (store) => store.timepole.currentUserTimePole
  );

  const showCurrentPoles = useMemo(() => {
    if (!month) {
      return currentPoles.poles;
    }

    const filteredPoles: StandardPoleData[] = [];

    if (currentPoles.status !== "not loaded") {
      for (let i = 0; i < currentPoles.poles.length; i++) {
        const poleMonth = currentPoles.poles[i].month;

        if (poleMonth + 1 === parseInt(month)) {
          filteredPoles.push(currentPoles.poles[i]);
        }
      }
    }

    return filteredPoles;
  }, [currentPoles, month]);

  useEffect(() => {
    yearLoader(year);
  }, [year]);
  return (
    <>
      <YearNavigation year={year ? parseInt(year) : current.year} />
      <TimeSpringContext>
        <ViewLinks page={month ? "month" : "year"} />
        {mode === "create" ? (
          <CreateTimeline poles={showCurrentPoles} />
        ) : (
          <>
            {currentPoles.status !== "not loaded" && (
              <DisplayTimeline
                timelineId={currentPoles.timelineId}
                sortData={
                  typeof currentPoles.sortData === "object"
                    ? currentPoles.sortData
                    : JSON.parse(currentPoles.sortData)
                }
                poles={currentPoles.poles}
                showPoles={showCurrentPoles}
              />
            )}
            <ViewTimeline />
          </>
        )}
      </TimeSpringContext>
    </>
  );
}
