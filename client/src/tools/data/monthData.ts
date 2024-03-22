const current_date = new Date();

interface MonthData {
  month: string;
  abb: string;
  days: number;
  dayOfYear: number;
}

export const monthByDate: {
  [key: number]: MonthData;
} = {
  1: { month: "January", abb: "Jan", days: 31, dayOfYear: 1 },
  32: { month: "February", abb: "Feb", days: 28, dayOfYear: 32 },
  60: { month: "March", abb: "Mar", days: 31, dayOfYear: 60 },
  91: { month: "April", abb: "Apr", days: 30, dayOfYear: 91 },
  121: { month: "May", abb: "May", days: 31, dayOfYear: 121 },
  152: { month: "June", abb: "Jun", days: 30, dayOfYear: 152 },
  182: { month: "July", abb: "Jul", days: 31, dayOfYear: 182 },
  213: { month: "August", abb: "Aug", days: 31, dayOfYear: 213 },
  244: { month: "September", abb: "Sep", days: 30, dayOfYear: 244 },
  274: { month: "October", abb: "Oct", days: 31, dayOfYear: 274 },
  305: { month: "November", abb: "Nov", days: 30, dayOfYear: 305 },
  335: { month: "December", abb: "Dec", days: 31, dayOfYear: 335 },
};

// -----

export const monthByIndex: { [key: number]: MonthData } = {
  1: monthByDate[1],
  2: monthByDate[32],
  3: monthByDate[60],
  4: monthByDate[91],
  5: monthByDate[121],
  6: monthByDate[152],
  7: monthByDate[182],
  8: monthByDate[213],
  9: monthByDate[244],
  10: monthByDate[274],
  11: monthByDate[305],
  12: monthByDate[335],
};

// -----

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

// -----

import { getDayOfYear } from "../utilities/dateFunction";

type Current = {
  year: number;
  today: {
    date: Date;
    date_format: string;
    percent: number;
    month: number;
  };
};

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

export const current: Current = {
  year: current_date.getFullYear(),
  today: {
    date: current_date,
    date_format: formattedDate,
    percent: todayPercent,
    month: current_date.getMonth(),
  },
};
