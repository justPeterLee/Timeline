import "./MonthPage.css";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { useParams } from "react-router-dom";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import { useMemo } from "react";
import { DisplayTimeline } from "../../components/Timelines/DisplayTimeline/DisplayTimeline";
export default function MonthPage() {
  const { month } = useParams();
  const poles = useAppSelector((store) => store.timepole.getTimePole);

  // console.log(poles);

  const filterPoles = useMemo(() => {
    return poles.filter((_pole: StandardPoleData) => {
      const poleDate = new Date(_pole.full_date);
      return poleDate.getMonth() + 1 == parseInt(month!);
    });
  }, [poles]);

  console.log(filterPoles);

  return <>{/* <DisplayTimeline poles={filterPoles} /> */}</>;
}
