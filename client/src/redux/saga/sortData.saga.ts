import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* sortDataSaga() {
  yield takeLatest("GET_SORTDATA_SERVER", getSortDataServer);
  yield takeLatest("POST_SORTDATA_SERVER", postSortDataServer);
  yield takeLatest("PUT_SORTDATA_SERVER", putSortDataServer);
}

interface SortDataPayload {
  payload: { timelineId: string };
  type: string;
}

function* getSortDataServer({ payload }: SortDataPayload): Generator {
  try {
    const data: any = yield axios.get(`/api/v1/sort/get/${payload.timelineId}`);
    put({ type: "SET_CURRENT_USER_TIMELINE_SORTDATA", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error getting sort data";
  }
}

function* postSortDataServer({ payload }: SortDataPayload): Generator {
  try {
    const data: any = yield axios.post("/api/v1/sort/post", payload);
    put({ type: "SET_CURRENT_USER_TIMELINE_SORTDATA", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error creating sort data";
  }
}

function* putSortDataServer({ payload }: SortDataPayload): Generator {
  try {
    const data: any = yield axios.put("/api/v1/sort/put", payload);
    put({ type: "SET_CURRENT_USER_TIMELINE_SORTDATA", payload: data.data });
  } catch (err) {
    console.log(err);
    throw "error updating sort data";
  }
}

export default sortDataSaga;
