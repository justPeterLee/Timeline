import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userAction.reducer";
import timepole from "./timePole.reducer";
export const rootReducer = combineReducers({
  userAccount: userReducer,
  timepole,
});
