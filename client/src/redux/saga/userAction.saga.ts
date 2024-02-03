import { put, takeLatest } from "redux-saga/effects";
import { Axios } from "axios";

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
    yield put({ type: "SET_USER", payload: payload });
  } catch (err) {
    console.log(err);
  }
}
export default userActionSaga;
