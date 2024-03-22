import { monthByIndex } from "../../../tools/data/monthData";

export function calcOriginPercent(
  selectedMonth: number,
  scaleRatio: number,
  timelineContainer: HTMLDivElement
) {
  const index = selectedMonth;

  if (index <= 1) {
    return 0;
  }
  if (index >= 12) {
    return 100;
  }

  const timelineContainerBCR = timelineContainer.getBoundingClientRect();

  const markerPos =
    (1 / 365) *
      (monthByIndex[index].dayOfYear - 1) *
      (timelineContainerBCR.width * scaleRatio) +
    timelineContainerBCR.x;

  const gapIdeal = 0.05 * timelineContainerBCR.width + timelineContainerBCR.x;

  const transGap = markerPos - gapIdeal;

  const scaleRatioPerPercent =
    (scaleRatio - 1) * (0.01 * timelineContainerBCR.width);

  const originPercent = transGap / scaleRatioPerPercent;

  return originPercent;
}

export function findScaleRatio(
  days: number,
  timelineContainer: HTMLDivElement
) {
  const timelineContainerBCR = timelineContainer.getBoundingClientRect();
  const gap = (1 / 365) * days * timelineContainerBCR.width;
  const gapIdeal = timelineContainerBCR.width * 0.9;

  const scaleRatio = gapIdeal / gap;

  return scaleRatio;
}
