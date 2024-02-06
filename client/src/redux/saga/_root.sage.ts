import { all } from "redux-saga/effects";
import userActionSaga from "./userAction.saga";
import timePoleSaga from "./timePole.saga";

export default function* rootSaga() {
  yield all([userActionSaga(), timePoleSaga()]);
}
