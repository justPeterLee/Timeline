// import { UseDispatch, useDispatch } from "react-redux";
import { useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAppSelector } from "../../redux/redux-hooks/redux.hook";
import { AllStandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
import { PoleSectionContainer } from "../../components/UserComponents/PoleSection";
import { monthByIndex } from "../../tools/data/monthData";
export default function UserPage() {
  const poles = useAppSelector((store) => store.timepole.getUserTimePole);

  const filterByYear = useMemo(() => {
    const filterObj: {
      [key: string]: { [key: string]: AllStandardPoleData[] };
    } = {};
    if (poles[0] !== "loading") {
      poles.map((_pole: AllStandardPoleData) => {
        // console.log(monthByIndex, _pole);
        const year = _pole.year;
        const month = monthByIndex[_pole.month + 1].month;

        if (!filterObj[year]) {
          filterObj[year] = {};
        }

        if (!filterObj[year][month]) {
          filterObj[year][month] = [];
        }

        filterObj[year][month].push(_pole);
      });
    }
    // console.log(filterObj);

    return filterObj;
  }, [poles]);

  return (
    <>
      <Navbar />

      {poles[0] !== "loading" && <PoleSectionContainer poles={filterByYear} />}
      <PoleSectionContainer poles={[]} />
    </>
  );
}
