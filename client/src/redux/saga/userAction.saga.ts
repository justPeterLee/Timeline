import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* userActionSaga() {
  yield takeLatest("REGISTER", registerUser);
}

type Params = {
  payload: { username: string; password: string; email: string };
  type: string;
};

function* registerUser({ payload }: Params): Generator {
  try {
    console.log("in saga", payload);
    yield axios.post("/api/v1/userAction/register", payload);
    yield put({ type: "SET_USER", payload: payload });
  } catch (err) {
    console.log(err);
  }
}
export default userActionSaga;
