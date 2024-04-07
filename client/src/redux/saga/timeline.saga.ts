import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timelineSaga() {
  yield takeLatest("GET_TIMELINE_SERVER", getTimelineUser);
}

function* getTimelineUser() {
  try {
  } catch (err) {
    throw "error with fetching user timeline";
  }
}
export default timelineSaga;
