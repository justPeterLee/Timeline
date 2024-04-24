// import { combineSlices } from "@reduxjs/toolkit";

import { combineReducers } from "redux";

interface action {
  type: string;
  payload: any;
}

const userReducer = (
  state = { id: null, username: "guest" },
  action: action
) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UNSET_USER":
      return { id: null, username: "guest" };
    default:
      return state;
  }
};

const userError = (
  state: { type: null | "login" | "register"; isError: boolean; lable: "" } = {
    type: null,
    isError: false,
    lable: "",
  },
  action: action
) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      return { ...state, type: "login", isError: true, lable: action.payload };
    case "REGISTER_ERROR":
      return {
        ...state,
        type: "register",
        isError: true,
        lable: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        type: null,
        isError: false,
        lable: "",
      };
    default:
      return state;
  }
};
// user will be on the redux state at:
// state.user
export default combineReducers({
  userReducer,
  userError,
});
