import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userAction.reducer";
export const rootReducer = combineReducers({
  userAccount: userReducer,
});
