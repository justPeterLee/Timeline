import { combineReducers } from "redux";
interface action {
  type: string;
  payload: any;
}

function getTimePole(state = [], action: action) {
  switch (action.type) {
    case "SET_TIME_POLE":
      return [...action.payload];
    default:
      return state;
  }
}

export default combineReducers({ getTimePole });
