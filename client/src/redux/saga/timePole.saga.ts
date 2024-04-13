import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { AllStandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";

function* timePoleSaga() {
  yield takeLatest("CREATE_TIMEPOLE_SERVER", createTimePoleSERVER);

  yield takeLatest("GET_TIMEPOLE_SERVER", getTimePoleSERVER);
  // yield takeLatest("GET_TIMEPOLE_MONTH_SERVER", getTimePoleMonthSERVER);
  // yield takeLatest("GET_TIMEPOLE_YEAR_SERVER", getTimePoleYearSERVER);

  yield takeLatest("GET_USER_TIMEPOLE", getUserTimepole);
  yield takeLatest("UPDATE_TIME_POLE_SERVER", updateTimePoleSERVER);

  yield takeLatest(
    "UPDATE_COMPLETED_TIME_POLE_SERVER",
    updateCompletedTimePoleServer
  );

  yield takeLatest("DELETE_TIME_POLE_SERVER", deleteTimePoleSERVER);
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
    // console.log(window.location);
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
    // console.log(window.location);
    const data: any = yield axios.get(
      `/api/v1/timepole/get/${payload.timelineId}`
    );
    yield put({ type: "SET_TIME_POLE", payload: data.data });
  } catch (err) {
    console.log(err);
  }
}

// function* getTimePoleYearSERVER({
//   payload,
// }: {
//   payload: { year: string };
//   type: string;
// }): Generator {
//   try {
//     const data: any = yield axios.get(`/api/v1/timepole/get/${payload.year}`);
//     console.log(data.data);
//     yield put({ type: "SET_TIME_POLE", payload: data.data });
//   } catch (err) {
//     throw "Error fetching data";
//   }
// }

// function* getTimePoleMonthSERVER({
//   payload,
// }: {
//   payload: { month: string };
//   type: string;
// }): Generator {
//   try {
//     const data: any = yield axios.get(`/api/v1/timepole/get/${payload.month}`);
//     yield put({ type: "SET_TIME_POLE", payload: data.data });
//   } catch (err) {
//     console.log(err);
//   }
// }

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
  payload: { pole: AllStandardPoleData; state: boolean };
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
  payload: AllStandardPoleData;
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
export default timePoleSaga;
