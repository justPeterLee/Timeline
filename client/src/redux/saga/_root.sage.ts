import { all } from "redux-saga/effects";
import userActionSaga from "./userAction.saga";
import timePoleSaga from "./timePole.saga";
import timelineSaga from "./timeline.saga";
import sortDataSaga from "./sortData.saga";

export default function* rootSaga() {
  yield all([userActionSaga(), timePoleSaga(), timelineSaga(), sortDataSaga()]);
}
