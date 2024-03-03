import sortBy from "lodash/sortBy";
import { randomNumberInRange } from "../utilities";
import {
  Orientation,
  OverLappingDataObj,
  PoleCordsData,
  SortedPoleData,
  StandardPoleData,
  UnSortedPoleData,
  calcNewCords,
  generateAccurateCords,
  orientationlimits,
} from "./timepoleUtils";

export function compareSortPoles(
  poles: StandardPoleData[],
  localData: PoleCordsData
): string[] {
  const poleData = poles.map((_pole) => {
    return _pole.id;
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

export function sort(poleData: UnSortedPoleData) {
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

      const currentTarget = document.querySelector(`#pole-${_poles.id}`);
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
          pole: _poles,
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
          pole: _poles,
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
          pole: _poles,
        };
      }

      //
      poleCordsData[_poles.id] = { yPos: generatedYPos };
    });
  }

  return poleCordsData;
}

export function insertSorData(poles: string[]) {
  for (let i = 0; i < poles.length; i++) {
    // console.log(document.querySelector(`#pole-${poles[i]}`));
  }
}
