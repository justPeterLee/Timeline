// import { UseDispatch, useDispatch } from "react-redux";
import { useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { PoleSectionContainer } from "../../components/UserComponents/PoleSection";
import { TimelinePole } from "../../tools/utilities/timepoleUtils/timepoleUtils";

export default function UserPage() {
  const timelinePole = useAppSelector((store) => store.timepole.userTimeline);

  const filterTimeline = useMemo(() => {
    const filterObj: {
      [timeline_Id: string]: {
        year: number;
        poles: { [month: string]: TimelinePole[] };
      };
    } = {};

    if (timelinePole.status !== "not loaded") {
      for (let i = 0; i < timelinePole.poles.length; i++) {
        const _pole = timelinePole.poles[i];
        const timeline_id = _pole.timeline_id;
        const year = _pole.year;
        const month = _pole.month;

        if (!filterObj[timeline_id]) {
          filterObj[timeline_id] = {
            year: year,
            poles: {},
          };
        }

        if (!filterObj[timeline_id].poles[month]) {
          filterObj[timeline_id].poles[month] = [];
        }

        filterObj[timeline_id].poles[month].push(_pole);
      }
    }

    return filterObj;
  }, [timelinePole]);

  return (
    <>
      <Navbar />

      {timelinePole.status !== "not loaded" && (
        <PoleSectionContainer poles={filterTimeline} />
      )}
    </>
  );
}
