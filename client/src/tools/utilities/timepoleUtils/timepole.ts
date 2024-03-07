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
  groupedPoles,
} from "./timepoleUtils";

export function compareSortPoles(
  poles: StandardPoleData[],
  localData: PoleCordsData
) {
  const poleData = groupedPoles(poles);
  const localDataKeys = Object.keys(localData);

  const addArray = [];
  const deleteArray = [];
  const addArrayObj: { [key: string]: string } = {};
  const poleMap = new Map();

  for (let i = 0; i < poleData.length; i++) {
    poleMap.set(
      poleData[i].sortId,
      !poleMap.get(poleData[i].sortId) ? 1 : poleMap.get(poleData[i].sortId) + 1
    );
    addArrayObj[poleData[i].sortId] = poleData[i].poleId;
  }

  for (let i = 0; i < localDataKeys.length; i++) {
    poleMap.set(
      localDataKeys[i],
      !poleMap.get(localDataKeys[i]) ? -1 : poleMap.get(localDataKeys[i]) - 1
    );
  }

  for (const [key, value] of poleMap.entries()) {
    // console.log(key, value);
    if (value > 0) {
      addArray.push({ sortId: key, poleId: addArrayObj[key] });
    } else if (value < 0) {
      deleteArray.push({ sortId: key, poleId: addArrayObj[key] });
    }
  }
  console.log(deleteArray);

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

      let generatedYPos = randomNumberInRange(90, 120);

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
        generatedYPos = -1 * (generatedYPos + (boundingClient.height - 2));
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
            currentCalcCords.bottom + 10 >= potentialCalcCords.top &&
            currentCalcCords.top + 10 <= potentialCalcCords.bottom
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
            boundingClient
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
  allPoles: StandardPoleData[],
  addPoles: { sortId: string; poleId: string }[],
  localSortData: PoleCordsData
) {
  console.time("start");
  const overlappingData = generateOverLappingData(allPoles, localSortData);
  const newSortData = localSortData;
  const heavenBound = window.innerHeight / 2 - 30;
  const hellBound = window.innerHeight / 2 + 30;

  for (let i = 0; i < addPoles.length; i++) {
    const _newPoleTarget = document.querySelector(
      `#pole-${addPoles[i].sortId}`
    ) as HTMLElement;
    if (!_newPoleTarget) continue;
    if (!_newPoleTarget.dataset.length) continue;

    if (parseInt(_newPoleTarget.dataset.length) > 1) {
      console.log("grouped");

      const findSortKey = addPoles[i].sortId
        .split("_")
        .filter((_key) => {
          return _key !== addPoles[i].poleId;
        })
        .join("_");
      console.log(findSortKey);
      console.log(localSortData[findSortKey]);
      // console.log(localSortData);

      newSortData[addPoles[i].sortId] = {
        yPos: localSortData[findSortKey].yPos,
      };

      continue;
    }

    const _newPoleBC = _newPoleTarget.getBoundingClientRect();

    // generate orientation
    const selectedOrientation = randomFifthyFifthy() ? "heaven" : "hell";

    // generate position
    let generatedYPos = 90;

    if (selectedOrientation === "heaven") {
      generatedYPos = -1 * (generatedYPos + (_newPoleBC.height - 2));
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

      return right >= _newPoleBC.left - 10 && left <= _newPoleBC.right + 10;
    });

    for (let i = 0; i < potentialPoles.length; i++) {
      // get potential from overlapping data
      const _potentialTarget =
        overlappingData[selectedOrientation][potentialPoles[i]];

      const _potentialTargetBC = _potentialTarget.boundingClient;
      let potentialTop = _potentialTargetBC.top;
      let potentialBot = _potentialTargetBC.bottom;

      if (
        _potentialTargetBC.top >= heavenBound &&
        _potentialTargetBC.top <= hellBound
      ) {
        potentialTop += _potentialTarget.y_pos;
        potentialBot += _potentialTarget.y_pos;
      }
      const newPoleTop = _newPoleBC.top + generatedYPos;
      const newPoleBot = _newPoleBC.bottom + generatedYPos;

      if (
        (newPoleBot + 10 >= potentialTop && newPoleTop - 10 <= potentialBot) ||
        generatedYPos === _potentialTarget.y_pos
      ) {
        const potentialPolesObjArray = potentialPoles.map((_key) => {
          return overlappingData[selectedOrientation][_key];
        });
        generatedYPos = generateAccurateCords(
          potentialPolesObjArray,
          _newPoleBC
        );
        break;
      }
    }

    // update overlapping data
    newSortData[addPoles[i].sortId] = { yPos: generatedYPos };
    // console.log(newSortData[newPoles[i]]);
  }

  // return
  console.timeEnd("start");
  return newSortData;
}
