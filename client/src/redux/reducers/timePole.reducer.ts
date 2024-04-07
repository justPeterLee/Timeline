import { combineReducers } from "redux";
interface action {
  type: string;
  payload: any;
}

function getTimePole(state = ["loading"], action: action) {
  switch (action.type) {
    case "SET_TIME_POLE":
      return [...action.payload];
    default:
      return state;
  }
}

function getUserTimePole(state = ["loading"], action: action) {
  switch (action.type) {
    case "SET_USER_TIMEPOLE":
      return [...action.payload];
    default:
      return state;
  }
}

function getUserTimeline(state = ["loading"], action: action) {
  switch (action.type) {
    case "SET_USER_TIMELINE":
      return [...action.payload];
    default:
      return state;
  }
}

export default combineReducers({
  getTimePole,
  getUserTimePole,
  getUserTimeline,
});
