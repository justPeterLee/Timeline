import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* userActionSaga() {
  yield takeLatest("REGISTER", registerUser);
  yield takeLatest("LOGIN", loginUser);
  yield takeLatest("LOGOUT", logoutUser);
  yield takeLatest("FETCH_USER", fetchUser);
}

type RegisterParams = {
  payload: { user: string; pass: string; email: string };
  type: string;
};

function* registerUser({ payload }: RegisterParams): Generator {
  try {
    yield axios.post("/api/v1/userAction/register", payload);
    yield put({
      type: "LOGIN",
      payload: { username: payload.user, password: payload.pass },
    });
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
    yield axios.post("/api/v1/userAction/login", payload, config);
    location.reload();
    // yield put({ type: "FETCH_USER" });
  } catch (err) {
    console.log(err);
  }
}

function* logoutUser(): Generator {
  try {
    yield axios.post("/api/v1/userAction/logout", config);
    yield put({ type: "UNSET_USER" });
  } catch (err) {
    console.log(err);
  }
}

function* fetchUser(): Generator {
  try {
    const response: any = yield axios.get("/api/v1/userAction", config);
    yield put({ type: "SET_USER", payload: response.data });
  } catch (err) {
    console.log(err);
  }
}

export default userActionSaga;
