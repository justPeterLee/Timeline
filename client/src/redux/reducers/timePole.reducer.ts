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

function setTimePoleData(state = {}, action: action) {
  switch (action.type) {
    case "SET_POLES_DATA":
      return (state = { ...state, value: action.payload });
    default:
      return state;
  }
}
export default combineReducers({ getTimePole, setTimePoleData });
