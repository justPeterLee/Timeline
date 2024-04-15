import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { StandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";

function* timePoleSaga() {
  yield takeLatest("CREATE_TIMEPOLE_SERVER", createTimePoleSERVER);

  yield takeLatest("GET_TIMEPOLE_SERVER", getTimePoleSERVER);

  yield takeLatest("GET_USER_TIMEPOLE", getUserTimepole);
  yield takeLatest("UPDATE_TIME_POLE_SERVER", updateTimePoleSERVER);

  yield takeLatest(
    "UPDATE_COMPLETED_TIME_POLE_SERVER",
    updateCompletedTimePoleServer
  );

  yield takeLatest("DELETE_TIME_POLE_SERVER", deleteTimePoleSERVER);

  yield takeLatest("UPDATE_SORTDATA_SERVER", updateSortDataSERVER);
}

type PostTimePole = {
  payload: {
    title: string;
    description: string;
    date_data: {
      date: number;
      month: number;
      year: number;
      day: number;
      full_date: string;
    };
    timelineId: number | null;
  };
  type: string;
};

function* getUserTimepole(): Generator {
  try {
    const data: any = yield axios.get("/api/v1/timepole");
    yield put({ type: "SET_USER_TIMEPOLE", payload: data.data });
  } catch (err) {
    console.log(err);
  }
}

function* getTimePoleSERVER({
  payload,
}: {
  payload: { timelineId: string };
  type: string;
}): Generator {
  try {
    const data: any = yield axios.get(
      `/api/v1/timepole/get/${payload.timelineId}`
    );
    yield put({ type: "SET_TIME_POLE", payload: data.data });
  } catch (err) {
    console.log(err);
  }
}

function* createTimePoleSERVER({ payload }: PostTimePole): Generator {
  try {
    const data: any = yield axios.post("/api/v1/timepole/create", payload);
    yield put({
      type: "GET_CURRENT_TIMEPOLE_SERVER",
      payload: { timelineId: data.data },
    });
  } catch (err) {
    console.log(err);
  }
}

function* updateTimePoleSERVER({ payload }: PostTimePole): Generator {
  try {
    console.log("in saga", payload);
    yield axios.put("/api/v1/timepole/update", payload);

    console.log(payload.timelineId);
    yield put({
      type: "GET_CURRENT_TIMEPOLE_SERVER",
      payload: { timelineId: payload.timelineId },
    });
  } catch (err) {
    console.log(err);
  }
}

function* updateCompletedTimePoleServer({
  payload,
}: {
  payload: { pole: StandardPoleData; state: boolean };
  type: string;
}) {
  try {
    yield axios.put(`/api/v1/timepole/update/completed/${payload.pole.id}`, {
      state: payload.state,
    });
    yield put({
      type: "GET_CURRENT_TIMEPOLE_SERVER",
      payload: { timelineId: payload.pole.year_id },
    });
  } catch (err) {
    console.log(err);
  }
}

function* deleteTimePoleSERVER({
  payload,
}: {
  payload: StandardPoleData;
  type: string;
}) {
  try {
    console.log(payload);
    yield axios.delete(`/api/v1/timepole/delete/${payload.id}`);
    yield put({
      type: "GET_CURRENT_TIMEPOLE_SERVER",
      payload: { timelineId: payload.year_id },
    });
  } catch (err) {
    console.log(err);
  }
}

function* updateSortDataSERVER({
  payload,
}: {
  payload: { timeline_id: string; sortData: string };
  type: string;
}): Generator {
  try {
    const data: any = yield axios.put(`/api/v1/sort/put`, payload);
    yield put({
      type: "SET_CURRENT_USER_TIMELINE_SORTDATA",
      payload: data.data,
    });
  } catch (err) {
    console.log(err);
    throw "error updating sort data";
  }
}
export default timePoleSaga;
