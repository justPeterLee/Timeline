import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timePoleSaga() {
  yield takeLatest("CREATE_TIMEPOLE_SERVER", createTimePoleSERVER);
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

function* createTimePoleSERVER({ payload }: PostTimePole) {
  try {
    console.log(payload);
    axios.post("/api/v1/timepole/create", payload);
  } catch (err) {
    console.log(err);
  }
}

export default timePoleSaga;
