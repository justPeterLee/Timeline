// month data
// year data
// today data

import {
  PoleData,
  StandardPoleData,
} from "./utilities/timepoleUtils/timepoleUtils";

// constants
const current_date = new Date();

type MonthDate = Record<
  number,
  { month: string; day: number; weeks: number; startDay: number; index: number }
>;

export const month_data: MonthDate = {
  0: {
    month: "jan",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 0,
    index: 1,
  },
  1: {
    month: "feb",
    day: 28,
    weeks: Math.floor(28 / 7),
    startDay: 31,
    index: 2,
  },
  2: {
    month: "mar",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 59,
    index: 3,
  },
  3: {
    month: "apr",
    day: 30,
    weeks: Math.floor(30 / 7),
    startDay: 90,
    index: 4,
  },
  4: {
    month: "may",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 120,
    index: 5,
  },
  5: {
    month: "jun",
    day: 30,
    weeks: Math.floor(30 / 7),
    startDay: 151,
    index: 6,
  },
  6: {
    month: "jul",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 181,
    index: 7,
  },
  7: {
    month: "aug",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 212,
    index: 8,
  },
  8: {
    month: "sep",
    day: 30,
    weeks: Math.floor(30 / 7),
    startDay: 243,
    index: 9,
  },
  9: {
    month: "oct",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 273,
    index: 10,
  },
  10: {
    month: "nov",
    day: 30,
    weeks: Math.floor(30 / 7),
    startDay: 304,
    index: 11,
  },
  11: {
    month: "dec",
    day: 31,
    weeks: Math.floor(31 / 7),
    startDay: 334,
    index: 12,
  },
};

// turns DATE to Number (2024-12-31 => 365)

function getDayOfYear(date: Date): number {
  // gets start of date
  const start = new Date(date.getFullYear(), 0, 0);

  // gets the difference from the start of the year and current date
  const diff = date.getTime() - start.getTime();

  // miliseconds in a day
  const oneDay = 24 * 60 * 60 * 1000;

  // mili x diff
  return Math.floor(diff / oneDay);
}

const currentDate = new Date();
const dayOfYear = getDayOfYear(currentDate);
const todayPercent = (100 / 365) * dayOfYear;

const date = new Date();

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", options);
const formattedDate = dateFormatter.format(date);

type Current = {
  year: number;
  today: {
    date: Date;
    date_format: string;
    percent: number;
    month: number;
  };
};

export const current: Current = {
  year: current_date.getFullYear(),
  today: {
    date: current_date,
    date_format: formattedDate,
    percent: todayPercent,
    month: current_date.getMonth(),
  },
};

// NUMBER to DATE (365 -> 2024-12-31)
export function getDateFromDayOfYear(dayOfYear: number, year: number) {
  let date = new Date(year, 0);
  date.setDate(dayOfYear);
  return date;
}

export function inputDateFormat(date: Date) {
  const currentDate = date;
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeek(date: Date) {
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset =
    (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);

  const firstDayDay = firstDayOfYear.getDay();
  const sub = firstDayDay === 0 ? 1 : firstDayDay === 1 ? 0 : 8 - firstDayDay;

  const weekNumber = Math.floor((daysOffset - sub) / 7);
  // console.log(midPoint);
  return { weekNumber: weekNumber + 1 };
}

export function getPoleData(pole: StandardPoleData, state: string) {
  // x-percent
  const date = new Date(pole.full_date);
  // console.log(pole);
  const dateNumber = state === "year" ? getDayOfYear(date) : date.getDate();

  const limit =
    state && state === "month"
      ? 100 / month_data[date.getMonth()].day
      : 100 / 365;

  // weekNumber
  const xPercent = limit * dateNumber;
  // console.log(dateNumber);

  const weekNumber = getWeek(date);
  return { xPercent, weekInfo: weekNumber };
}

export function getPoleDataList(poles: StandardPoleData[], state: string) {
  const poleWeekList: PoleData = {};
  // console.log(poles);

  for (let i = 0; i < poles.length; i++) {
    const poleData = getPoleData(poles[i], state);

    const weekPoleTwo = poleWeekList[poleData.weekInfo.weekNumber];
    const pole = poles[i];
    const poleDate = pole.full_date;
    const poleId = pole.id;
    const xPercent = poleData.xPercent;

    if (weekPoleTwo) {
      console.log(weekPoleTwo.polesList[poleDate].id, poleId);
      // check if date instance exists
      if (weekPoleTwo.polesList[poleDate]) {
        weekPoleTwo.polesList[poleDate].poles.push(pole);
        weekPoleTwo.polesList[poleDate].id = weekPoleTwo.polesList[
          poleDate
        ].id.concat("_", poleId);
      } else {
        weekPoleTwo.polesList[poleDate] = {
          id: poleId,
          poles: [pole],
          xPercent: xPercent,
        };
      }
    } else {
      poleWeekList[poleData.weekInfo.weekNumber] = {
        polesList: {
          [poleDate]: { id: poleId, poles: [pole], xPercent: xPercent },
        },
      };
    }
  }

  return poleWeekList;
}
