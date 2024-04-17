import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timelineSaga() {
  yield takeLatest("GET_TIMELINE_SERVER", getTimelineUser);

  yield takeLatest("GET_TIMELINE_ALL_SERVER", getTimelineAllUser);

  yield takeLatest("GET_CURRENT_TIMEPOLE_SERVER", getCurrentTimePoleUser);

  yield takeLatest("POST_TIMELINE_SERVER", postTimelineUser);
}

function* getTimelineUser(): Generator {
  console.log("in saga");
  try {
    const data: any = yield axios.get("/api/v1/timeline/get");
    console.log(data.data);
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
    const data: any = yield axios.post("/api/v1/timeline/create", payload);
    console.log(data.data);
    // yield put({ type: "SET_USER_TIMELINE", payload: data.data });
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
    console.log(data.data);
    yield put({ type: "SET_CURRENT_USER_TIMEPOLE_ALL", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error fetching current pole data";
  }
}
export default timelineSaga;
