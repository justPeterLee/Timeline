import sortBy from "lodash/sortBy";
import { randomFifthyFifthy, randomNumberInRange } from "../utilities";
import {
  Orientation,
  OverLappingDataObj,
  PoleCordsData,
  SortedPoleData,
  StandardPoleData,
  calcNewCords,
  generateAccurateCords,
  orientationlimits,
  generateOverLappingData,
  PoleData,
} from "./timepoleUtils";

export function compareSortPoles(
  poles: StandardPoleData[],
  localData: PoleCordsData
): string[] {
  const poleDataObj: { [key: string]: string } = {};

  for (let i = 0; i < poles.length; i++) {
    if (poleDataObj[poles[i].full_date]) {
      poleDataObj[poles[i].full_date] = poleDataObj[poles[i].full_date].concat(
        poles[i].id
      );
    } else {
      poleDataObj[poles[i].full_date] = poles[i].id;
    }
  }

  const poleData = Object.keys(poleDataObj).map((_key) => {
    return poleDataObj[_key];
  });

  const localDataKeys = Object.keys(localData);

  const addArray = [];
  const poleMap = new Map();

  for (let i = 0; i < poleData.length; i++) {
    poleMap.set(
      poleData[i],
      !poleMap.get(poleData[i]) ? 1 : poleMap.get(poleData[i]) + 1
    );
  }

  for (let i = 0; i < localDataKeys.length; i++) {
    poleMap.set(
      localDataKeys[i],
      !poleMap.get(localDataKeys[i]) ? -1 : poleMap.get(localDataKeys[i]) - 1
    );
  }

  for (const [key, value] of poleMap.entries()) {
    if (value > 0) {
      addArray.push(key);
    }
  }

  return addArray;
}

export function sortPoleData(poleData: PoleData) {
  if (!poleData) return;
  const unsortedPoleDataKeys: string[] = Object.keys(poleData);
  const sortedPoleData: SortedPoleData = {};

  // console.log(poleData);
  for (let i = 0; i < unsortedPoleDataKeys.length; i++) {
    const extractedPole = Object.keys(
      poleData[unsortedPoleDataKeys[i]].polesList
    ).map((_poleInstance) => {
      // console.log(poleData[unsortedPoleDataKeys[i]].polesList);
      return {
        id: poleData[unsortedPoleDataKeys[i]].polesList[_poleInstance].id,
        date: _poleInstance,
      };
    });

    // console.log(extractedPole);
    const sortedExtractedPoles = sortBy(extractedPole, (obj) => obj.date);
    sortedPoleData[unsortedPoleDataKeys[i]] = sortedExtractedPoles;
  }

  console.log(sortedPoleData);
  return sortedPoleData;
}

export function sort(poleData: PoleData) {
  const sortedData = sortPoleData(poleData);

  if (!sortedData) return;
  if (Object.keys(sortedData).length === 0) return;

  const sortedDataKeys = Object.keys(sortedData);

  // ------------------------------------------------------
  const poleCordsData: PoleCordsData = {};

  const overlappingData: {
    heaven: OverLappingDataObj;
    hell: OverLappingDataObj;
  } = { heaven: {}, hell: {} };

  const lastPoleData: { [key: string]: string } = {};

  // ------------------------------------------------------
  for (let i = 0; i < sortedDataKeys.length; i++) {
    // ----------------------------------------------------
    const weekId = sortedDataKeys[i];
    const weekObj = sortedData[sortedDataKeys[i]];

    const OrientationClass = new Orientation(
      weekId,
      orientationlimits(sortedDataKeys.length)
    );

    // ----------------------------------------------------
    sortedData[weekId].map((_poles, index) => {
      const lastPoleOrientation = lastPoleData[sortedDataKeys[i - 1]];

      const currentTarget = document.getElementById(`pole-${_poles.id}`);
      // console.log(currentTarget);

      const boundingClient = currentTarget
        ? currentTarget.getBoundingClientRect()
        : undefined;

      if (!boundingClient) return;

      let selectedOrientation: "heaven" | "hell" = "heaven";

      let generatedYPos = randomNumberInRange(90, 200);

      // --------------------------------------------------
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

      if (selectedOrientation === "heaven") {
        generatedYPos = -1 * (generatedYPos + 5 + boundingClient.height);
      }

      // --------------------------------------------------
      const sameOrientationKeys = Object.keys(
        overlappingData[selectedOrientation]
      );

      //
      if (!sameOrientationKeys.length) {
        overlappingData[selectedOrientation][boundingClient.right] = {
          boundingClient: boundingClient,
          y_pos: generatedYPos,
        };
      }

      //
      const potentialOverlapKeys = sameOrientationKeys.filter((rightCord) => {
        return parseFloat(rightCord) > boundingClient.left;
      });

      //
      if (!potentialOverlapKeys.length) {
        overlappingData[selectedOrientation][boundingClient.right] = {
          boundingClient: boundingClient,
          y_pos: generatedYPos,
        };
      } else {
        let isOverlapping = false;
        const currentCalcCords = calcNewCords(
          generatedYPos,
          boundingClient.height
        );

        // -----------------------------------------------
        for (let i = 0; i < potentialOverlapKeys.length; i++) {
          const currentPotential =
            overlappingData[selectedOrientation][potentialOverlapKeys[i]];

          const potentialCalcCords = calcNewCords(
            currentPotential.y_pos,
            currentPotential.boundingClient.height
          );

          // ---------------------------------------------
          if (
            currentCalcCords.bottom >= potentialCalcCords.top &&
            currentCalcCords.top <= potentialCalcCords.bottom
          ) {
            isOverlapping = true;
            break;
          }
        }

        //
        if (isOverlapping) {
          const potentailPolesArr = potentialOverlapKeys.map((_) => {
            return overlappingData[selectedOrientation][_];
          });

          generatedYPos = generateAccurateCords(
            potentailPolesArr,
            boundingClient.height
          );
        }

        //
        overlappingData[selectedOrientation][boundingClient.right] = {
          boundingClient: boundingClient,
          y_pos: generatedYPos,
        };
      }

      //
      poleCordsData[_poles.id] = { yPos: generatedYPos };
    });
  }

  return poleCordsData;
}

export function insertSorData(
  oldPoles: StandardPoleData[],
  newPoles: string[],
  sortData: PoleCordsData
) {
  console.time("start");
  const overlappingData = generateOverLappingData(oldPoles, sortData);
  console.log(overlappingData);
  const newSortData = sortData;
  for (let i = 0; i < newPoles.length; i++) {
    const _newPoleTarget = document.getElementById(`pole-${newPoles[i]}`);
    if (!_newPoleTarget) continue;

    const _newPoleBC = _newPoleTarget.getBoundingClientRect();

    // generate orientation
    const selectedOrientation = randomFifthyFifthy() ? "heaven" : "hell";

    // generate position
    let generatedYPos = randomNumberInRange(90, 200);

    if (selectedOrientation === "heaven") {
      generatedYPos = -1 * (generatedYPos + 5 + _newPoleBC.height);
    }

    // get potential poles
    const sameOrientationKeys = Object.keys(
      overlappingData[selectedOrientation]
    );

    // check potential poles
    const potentialPoles = sameOrientationKeys.filter((_cords) => {
      const cords = _cords.split("_");
      const right = parseInt(cords[0]);
      const left = parseInt(cords[1]);

      return right > _newPoleBC.left && left < _newPoleBC.right;
    });

    for (let i = 0; i < potentialPoles.length; i++) {
      const _potenialTarget =
        overlappingData[selectedOrientation][potentialPoles[i]];
      const _potenialTargetBC = _potenialTarget.boundingClient;

      // console.log(overlappingData[selectedOrientation][potentialPoles[i]]);

      const potentialTop = _potenialTargetBC.top + _potenialTarget.y_pos;
      const potentialBot = _potenialTargetBC.bottom + _potenialTarget.y_pos;

      const newPoleTop = _newPoleBC.top + generatedYPos;
      const newPoleBot = _newPoleBC.bottom + generatedYPos;

      if (newPoleBot >= potentialTop && newPoleTop <= potentialBot) {
        const potentialPolesObjArray = potentialPoles.map((_key) => {
          return overlappingData[selectedOrientation][_key];
        });
        generatedYPos = generateAccurateCords(
          potentialPolesObjArray,
          _newPoleBC.height
        );
        break;
      }
    }

    // update overlapping data
    newSortData[newPoles[i]] = { yPos: generatedYPos };
    // console.log(newSortData[newPoles[i]]);
  }

  // return
  console.timeEnd("start");
  return newSortData;
}
