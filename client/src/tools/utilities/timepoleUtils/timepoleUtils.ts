import { month_data } from "../../data/monthData";
import { getWeek, getDayOfYear } from "../dateFunction";
import { randomFifthyFifthy as random } from "../utilities";

export interface StandardPoleData {
  id: string;
  year_id: string;

  title: string;
  description: string;
  completed: boolean;

  date: number;
  month: number;
  year: number;
  full_date: string;
}

export interface TimelinePole {
  year: number;
  month: number;
  date: number;
  full_date: string;
  pole_id: string;
  pole_title: string;
  timeline_id: number;
}

export type PoleDatas = Record<
  string,
  {
    midPoint: number;
    polesList: { pole: StandardPoleData; xPercent: number }[];
  }
>;

export interface PoleData {
  [key: string]: {
    polesList: {
      [key: string]: {
        id: string;
        poles: StandardPoleData[];
        xPercent: number;
      };
    };
  };
}

export interface UnSortedPoleData {
  [key: string]: {
    polesList: { pole: StandardPoleData; xPercent: number }[];
    midPoint: number;
  };
}

export interface SortedPoleData {
  [key: string]: { id: string; date: string }[];
}

export interface OverLappingData {
  boundingClient: DOMRect;
  y_pos: number;
}

export interface OverLappingDataObj {
  [key: string]: OverLappingData;
}

export interface PoleCordsData {
  [key: string]: { yPos: number };
}

interface OrientationObj {
  [key: string]: { heaven: number; hell: number; total: number };
}

type UpdateSortData = { sortId: string; poleId: string }[];
export interface SortDataChanges {
  addArray: UpdateSortData;
  deleteArray: UpdateSortData;
}

export class Orientation {
  _week: string;
  _heaven: number;
  _hell: number;
  _total: number;
  _lastPole: string;

  constructor(
    week: string,
    orientaionSet: { heaven: number; hell: number; total: number }
  ) {
    this._week = week;
    this._heaven = orientaionSet.heaven;
    this._hell = orientaionSet.hell;
    this._total = orientaionSet.total;
    this._lastPole = "";
  }

  get hell() {
    return this._hell;
  }

  get heaven() {
    return this._heaven;
  }

  get total() {
    return this._total;
  }

  get last() {
    return { week: this._week, last: this._lastPole };
  }

  set lastPole(orientation: string) {
    this._lastPole = orientation;
  }

  generateHeaven(): "heaven" {
    this._heaven -= 1;
    this._total -= 1;
    return "heaven";
  }

  generateHell(): "hell" {
    this._hell -= 1;
    this._total -= 1;
    return "hell";
  }

  generateRandom(): "heaven" | "hell" {
    const random = Math.random();

    if (random < 0.5) {
      return this.generateHeaven();
    } else {
      return this.generateHell();
    }
  }

  generateOrientation(): "heaven" | "hell" {
    if (this.heaven > 0 && this.hell > 0) {
      return this.generateRandom();
    } else if (this.heaven > 0 && this.hell <= 0) {
      return this.generateHeaven();
    } else if (this.heaven <= 0 && this.hell > 0) {
      return this.generateHell();
    } else {
      throw `error: invalid amounts of poles in week ${this._week}`;
    }
  }
}

export function calcNewCords(Ypos: number, height: number, margin = 5) {
  const top = Ypos + window.innerHeight / 2 + margin;
  const bottom = Ypos + (window.innerHeight / 2 + margin + height);

  return { top, bottom };
}

export function generateAccurateCords(
  potentialPoles: OverLappingData[],
  bc: DOMRect
) {
  const height = bc.height;
  const bounds = [];

  for (let i = 0; i < potentialPoles.length; i++) {
    const newCalc = calcNewCords(
      potentialPoles[i].y_pos,
      potentialPoles[i].boundingClient.height
    );
    bounds.push(newCalc.top);
    bounds.push(newCalc.bottom);
  }

  const topBound = Math.min(...bounds);

  const bottomBound = Math.max(...bounds);

  const abovePos = topBound - (window.innerHeight / 2 + 5) - (10 + height);
  const belowPos =
    bottomBound - (window.innerHeight / 2 + height + 5) + (10 + height);

  const aboveBC = calcNewCords(abovePos, height);
  const belowBC = calcNewCords(belowPos, height);

  const heavenBound = window.innerHeight / 2 - 30;
  const hellBound = window.innerHeight / 2 + 30;

  if (
    (aboveBC.bottom > heavenBound && aboveBC.bottom < hellBound) ||
    (aboveBC.top < heavenBound && aboveBC.bottom > hellBound) ||
    (aboveBC.top > heavenBound && aboveBC.top < hellBound)
  ) {
    return belowPos;
  } else if (
    (belowBC.bottom > heavenBound && belowBC.bottom < hellBound) ||
    (belowBC.top < heavenBound && belowBC.bottom > hellBound) ||
    (belowBC.top > heavenBound && belowBC.top < hellBound)
  ) {
    return abovePos;
  } else {
    if (random()) {
      return abovePos;
    } else {
      return belowPos;
    }
  }
}

export function orientationlimits(length: number) {
  const selection = length <= 7 ? length : 7;

  const orientationObj: OrientationObj = {
    1: { heaven: 1, hell: 1, total: length },
    2: { heaven: 2, hell: 2, total: length },
    3: { heaven: 2, hell: 2, total: length },
    4: { heaven: 2, hell: 2, total: length },
    5: { heaven: 3, hell: 3, total: length },
    6: { heaven: 3, hell: 3, total: length },
    7: { heaven: 4, hell: 4, total: length },
  };

  return orientationObj[selection as keyof OrientationObj];
}

export function generateOverLappingData(
  oldPoles: StandardPoleData[],
  sortData: PoleCordsData
) {
  // console.log(sortData, oldPoles);
  const overlappingData: {
    heaven: OverLappingDataObj;
    hell: OverLappingDataObj;
  } = { heaven: {}, hell: {} };

  const windowhalf = window.innerHeight / 2;

  const poleDataSet: Set<string> = new Set();
  oldPoles.map((_pole) => {
    poleDataSet.add(generatePoleKey(_pole.full_date));
  });
  const poleData = [...poleDataSet];

  for (let i = 0; i < poleData.length; i++) {
    const _oldTarget = document.getElementById(`pole-${poleData[i]}`);
    // console.log(poleData[i]);
    const _sortDataTarget = sortData[poleData[i]];
    if (!_oldTarget || !_sortDataTarget) {
      continue;
    }
    const _oldTargetBC = _oldTarget.getBoundingClientRect();

    const orientation = _oldTargetBC.top + _sortDataTarget.yPos;
    // console.log(orientation, windowhalf);

    if (orientation <= windowhalf) {
      overlappingData.heaven[`${_oldTargetBC.right}_${_oldTargetBC.left}`] = {
        boundingClient: _oldTarget.getBoundingClientRect(),
        y_pos: _sortDataTarget.yPos,
      };
    } else {
      overlappingData.hell[`${_oldTargetBC.right}_${_oldTargetBC.left}`] = {
        boundingClient: _oldTarget.getBoundingClientRect(),
        y_pos: _sortDataTarget.yPos,
      };
    }
  }

  return overlappingData;
}

export function deleteSortDatas(
  deletePoles: { sortId: string; poleId: string | undefined }[],
  localSortData: PoleCordsData
) {
  const newSortData = localSortData;

  for (let i = 0; i < deletePoles.length; i++) {
    if (newSortData[deletePoles[i].sortId]) {
      delete newSortData[deletePoles[i].sortId];
    }
  }

  return newSortData;
}

export function generatePoleKey(_pole: string) {
  const date = new Date(_pole);

  return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
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
