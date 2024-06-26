import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timelineSaga() {
  yield takeLatest("GET_TIMELINE_SERVER", getTimelineUser);

  yield takeLatest("GET_TIMELINE_ALL_SERVER", getTimelineAllUser);

  yield takeLatest("GET_CURRENT_TIMEPOLE_SERVER", getCurrentTimePoleUser);

  yield takeLatest("POST_TIMELINE_SERVER", postTimelineUser);

  yield takeLatest("DELETE_TIMELINE_SERVER", deleteTimelineSERVER);
}

function* getTimelineUser(): Generator {
  console.log("in saga");
  try {
    const data: any = yield axios.get("/api/v1/timeline/get");
    yield put({ type: "SET_USER_TIMELINE", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error with fetching user timeline";
  }
}

function* getTimelineAllUser(): Generator {
  try {
    const data: any = yield axios.get("/api/v1/timeline/get/all");
    yield put({ type: "SET_USER_TIMELINE", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error with fetching user timeline";
  }
}
function* postTimelineUser({
  payload,
}: {
  payload: { title: string; year: string };
  type: string;
}): Generator {
  try {
    yield axios.post("/api/v1/timeline/create", payload);
  } catch (err) {
    console.log(err);
    throw "error with create timeline";
  }
}

function* getCurrentTimePoleUser({
  payload,
}: {
  payload: { timelineId: string };
  type: string;
}): Generator {
  try {
    const data: any = yield axios.get(
      `/api/v1/timeline/get/current/${payload.timelineId}`
    );
    yield put({ type: "SET_CURRENT_USER_TIMEPOLE_ALL", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error fetching current pole data";
  }
}

function* deleteTimelineSERVER({
  payload,
}: {
  payload: { year: string };
  type: string;
}): Generator {
  try {
    yield axios.delete(`/api/v1/timeline/delete/${payload.year}`);
    yield put({ type: "GET_TIMELINE_ALL_SERVER" });
  } catch (err) {
    console.log(err);
    throw "error deleting timeline";
  }
}
export default timelineSaga;
