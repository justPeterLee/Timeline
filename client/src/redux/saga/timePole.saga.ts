import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* timePoleSaga() {
  yield takeLatest("CREATE_TIMEPOLE", createTimePole);
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

function* createTimePole({ payload }: PostTimePole) {
  try {
    console.log(payload);
  } catch (err) {
    console.log(err);
  }
}
export default timePoleSaga;
