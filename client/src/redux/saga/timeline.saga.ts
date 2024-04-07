import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timelineSaga() {
  yield takeLatest("GET_TIMELINE_SERVER", getTimelineUser);
}

function* getTimelineUser() {
  try {
    console.log("in saga");
    yield put({ type: "SET_USER_TIMELINE", payload: [] });
  } catch (err) {
    console.log(err);
    throw "error with fetching user timeline";
  }
}
export default timelineSaga;
