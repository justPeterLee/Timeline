function random() {
  return Math.random() < 0.5;
}

function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// pre-requisite data for sort

import sortBy from "lodash/sortBy";

type StandardPoleData = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  date: number;
  month: number;
  year: number;
  day: number;
  full_date: string;
};

type UnSortedPoleData = {
  [key: string]: {
    polesList: { pole: StandardPoleData; xPercent: number }[];
    midPoint: number;
  };
};

type SortedPoleData = {
  [key: string]: StandardPoleData[];
};

export function sortPoleData(poleData: UnSortedPoleData) {
  if (!poleData) return;
  const unsortedPoleDataKeys: string[] = Object.keys(poleData);
  const sortedPoleData: SortedPoleData = {};

  for (let i = 0; i < unsortedPoleDataKeys.length; i++) {
    const extractedPole = poleData[unsortedPoleDataKeys[i]].polesList.map(
      (_poleInstance) => {
        return _poleInstance.pole;
      }
    );

    const sortedExtractedPoles = sortBy(extractedPole, (obj) => obj.full_date);
    sortedPoleData[unsortedPoleDataKeys[i]] = sortedExtractedPoles;
  }

  return sortedPoleData;
}

type OrientationObj = {
  [key: string]: { heaven: number; hell: number; total: number };
};

function orientationlimits(length: number) {
  const selection = length <= 4 ? length : 4;

  const orientationObj: OrientationObj = {
    1: { heaven: 1, hell: 1, total: 1 },
    2: { heaven: 2, hell: 2, total: 2 },
    3: { heaven: 2, hell: 2, total: 3 },
    4: { heaven: 2, hell: 2, total: 4 },
  };

  return orientationObj[selection as keyof OrientationObj];
}

export function sort(poleData: UnSortedPoleData) {
  const sortedData = sortPoleData(poleData);

  if (!sortedData) return;
  if (Object.keys(sortedData).length === 0) return;

  const sortedDataKeys = Object.keys(sortedData);

  const poleCordsData = {};
  const overlappingData: { heaven: any; hell: any } = { heaven: {}, hell: {} };
  const lastPoleData: { [key: string]: string } = {};

  for (let i = 0; i < sortedDataKeys.length; i++) {
    const weekId = sortedDataKeys[i];
    const weekObj = sortedData[sortedDataKeys[i]];

    const OrientationClass = new Orientation(
      weekId,
      orientationlimits(sortedDataKeys.length)
    );

    sortedData[weekId].map((_poles, index) => {
      const week = sortedDataKeys[i - 1];
      const lastPoleOrientation = lastPoleData[week];

      let selectedOrientation: "heaven" | "hell" | "" = "";
      let generatedYPos = randomNumberInRange(90, 200);

      // check if first pole of week
      if (index === 0) {
        // check preivous pole (make sure not first week)
        if (Object.keys(lastPoleData).length !== 0 && i > 0) {
          if (lastPoleOrientation === "heaven") {
            selectedOrientation = OrientationClass.generateHell();
          } else {
            selectedOrientation = OrientationClass.generateHeaven();
          }
        } else {
          selectedOrientation = OrientationClass.generateOrientation();
        }
      } else {
        selectedOrientation = OrientationClass.generateOrientation();
      }

      // if last pole
      if (index === weekObj.length - 1)
        lastPoleData[weekId] = selectedOrientation;

      if (selectedOrientation)
        overlappingData[selectedOrientation] = {
          ...overlappingData[selectedOrientation],
          [_poles.id]: _poles,
        };
    });
  }

  console.log(overlappingData);
  console.log(lastPoleData);
}

class Orientation {
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
