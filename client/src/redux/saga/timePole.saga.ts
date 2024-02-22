import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timePoleSaga() {
  yield takeLatest("CREATE_TIMEPOLE_SERVER", createTimePoleSERVER);

  yield takeLatest("GET_TIMEPOLE_SERVER", getTimePoleSERVER);

  yield takeLatest("UPDATE_TIME_POLE_SERVER", updateTimePoleSERVER);

  yield takeLatest(
    "UPDATE_COMPLETED_TIME_POLE_SERVER",
    updateCompletedTimePoleServer
  );
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
  };
  type: string;
};

function* getTimePoleSERVER(): Generator {
  try {
    // console.log(window.location);
    const data: any = yield axios.get("/api/v1/timepole");
    yield put({ type: "SET_TIME_POLE", payload: data.data });
  } catch (err) {
    console.log(err);
  }
}

function* createTimePoleSERVER({ payload }: PostTimePole): Generator {
  try {
    console.log(payload);
    yield axios.post("/api/v1/timepole/create", payload);
    yield put({ type: "GET_TIMEPOLE_SERVER" });
  } catch (err) {
    console.log(err);
  }
}

function* updateTimePoleSERVER({ payload }: PostTimePole): Generator {
  try {
    console.log("in saga", payload);
    yield axios.put("/api/v1/timepole/update", payload);
    yield put({ type: "GET_TIMEPOLE_SERVER" });
  } catch (err) {
    console.log(err);
  }
}

function* updateCompletedTimePoleServer({
  payload,
}: {
  payload: { id: string; state: boolean };
  type: string;
}) {
  try {
    yield axios.put(`/api/v1/timepole/update/completed/${payload.id}`, {
      state: payload.state,
    });
    yield put({ type: "GET_TIMEPOLE_SERVER" });
  } catch (err) {
    console.log(err);
  }
}
export default timePoleSaga;
