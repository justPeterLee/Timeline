import { combineReducers } from "redux";
interface action {
  type: string;
  payload: any;
}

function getTimePole(state = [], action: action) {
  switch (action.type) {
    case "SET_TIME_POLE":
      console.log("in redux", action.payload);
      return action.payload;
    default:
      return state;
  }
}
export default combineReducers({ getTimePole });
