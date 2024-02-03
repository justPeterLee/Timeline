import { all } from "redux-saga/effects";
import userActionSaga from "./userAction.saga";

export default function* rootSaga() {
  yield all([userActionSaga()]);
}
