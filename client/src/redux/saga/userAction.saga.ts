import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* userActionSaga() {
  yield takeLatest("REGISTER", registerUser);
  yield takeLatest("LOGIN", loginUser);
}

type RegisterParams = {
  payload: { user: string; pass: string; email: string };
  type: string;
};

function* registerUser({ payload }: RegisterParams): Generator {
  try {
    console.log("in saga", payload);
    yield axios.post("/api/v1/userAction/register", payload);
    yield put({ type: "SET_USER", payload: payload });
  } catch (err) {
    console.log(err);
  }
}

type LoginParams = {
  payload: { user: string; pass: string };
  type: string;
};
const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

function* loginUser({ payload }: LoginParams): Generator {
  try {
    console.log("saga", payload);
    yield axios.post("/api/v1/userAction/login", payload, config);
  } catch (err) {
    console.log(err);
  }
}
export default userActionSaga;
