import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timelineSaga() {
  yield takeLatest("GET_TIMELINE_SERVER", getTimelineUser);
  yield takeLatest("POST_TIMELINE_SERVER", postTimelineUser);
}

function* getTimelineUser(): Generator {
  try {
    console.log("in saga");
    const data: any = yield axios.get("/api/v1/timeline/get");
    yield put({ type: "SET_USER_TIMELINE", payload: data });
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
}) {
  try {
    yield axios.post("/api/v1/timeline/create", payload);
    yield put({ type: "GET_TIMELINE_SERVER" });
  } catch (err) {
    console.log(err);
    throw "error with create timeline";
  }
}
export default timelineSaga;
