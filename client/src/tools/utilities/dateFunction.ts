// turns DATE to Number (2024-12-31 => 365)

import { current } from "../data/monthData";

export function getDayOfYear(date: Date): number {
  // gets start of date
  const start = new Date(date.getFullYear(), 0, 0);

  // gets the difference from the start of the year and current date
  const diff = date.getTime() - start.getTime();

  // miliseconds in a day
  const oneDay = 24 * 60 * 60 * 1000;

  // mili x diff
  return Math.floor(diff / oneDay);
}

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

export function percentToDate(
  e: PointerEvent | React.MouseEvent<HTMLDivElement, MouseEvent>,
  year: string | undefined
) {
  const timelineBCR = document
    .getElementById("timeline")!
    .getBoundingClientRect();
  const timelinePercent =
    Math.abs(timelineBCR.x - e.clientX) / timelineBCR.width;

  const dayOfYear = Math.ceil(365 * timelinePercent);
  const selectedYear = year ? parseInt(year) : current.year;
  // const date = getDateFromDayOfYear(dayOfYear, selectedYear);
  return getDateFromDayOfYear(dayOfYear, selectedYear);
}
