import { randomFifthyFifthy as random } from "../utilities";

export interface StandardPoleData {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  full_date: string;
}

export type PoleDatas = Record<
  string,
  {
    midPoint: number;
    polesList: { pole: StandardPoleData; xPercent: number }[];
  }
>;

export interface UnSortedPoleData {
  [key: string]: {
    polesList: { pole: StandardPoleData; xPercent: number }[];
    midPoint: number;
  };
}

export interface SortedPoleData {
  [key: string]: StandardPoleData[];
}

export interface OverLappingData {
  boundingClient: DOMRect;
  pole: StandardPoleData;
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
  height: number
) {
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

  if (random()) {
    return topBound - (window.innerHeight / 2 + 5) - (20 + height);
  } else {
    return bottomBound - (window.innerHeight / 2 + height + 5) + (20 + height);
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
  const overlappingData: {
    heaven: OverLappingDataObj;
    hell: OverLappingDataObj;
  } = { heaven: {}, hell: {} };

  const windowhalf = window.innerHeight / 2;
  for (let i = 0; i < oldPoles.length; i++) {
    const _oldPole = oldPoles[i];
    const _oldTarget = document.getElementById(`pole-${oldPoles[i].id}`);
    const _sortDataTarget = sortData[oldPoles[i].id];
    if (!_oldTarget || !_sortDataTarget) {
      continue;
    }
    const _oldTargetBC = _oldTarget.getBoundingClientRect();

    const orientation = _oldTargetBC.top + _sortDataTarget.yPos;
    // console.log(orientation, windowhalf);

    if (orientation <= windowhalf) {
      overlappingData.heaven[`${_oldTargetBC.right}_${_oldTargetBC.left}`] = {
        pole: _oldPole,
        boundingClient: _oldTarget.getBoundingClientRect(),
        y_pos: _sortDataTarget.yPos,
      };
    } else {
      overlappingData.hell[`${_oldTargetBC.right}_${_oldTargetBC.left}`] = {
        pole: _oldPole,
        boundingClient: _oldTarget.getBoundingClientRect(),
        y_pos: _sortDataTarget.yPos,
      };
    }
  }

  return overlappingData;
}