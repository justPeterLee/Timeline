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

interface TimelineState {
  status: "loading" | "completed" | "not loaded";
  [key: string]: string;
}
function getUserTimeline(
  state: TimelineState = { status: "not loaded" },
  action: { payload: { id: string; year: string }[]; type: string }
) {
  switch (action.type) {
    case "SET_USER_TIMELINE":
      state = { ...state, status: "loading" };

      for (let i = 0; i < action.payload.length; i++) {
        state = { ...state, [action.payload[i].year]: action.payload[i].id };
      }

      state = { ...state, status: "completed" };

      return state;
    default:
      return state;
  }
}

export default combineReducers({
  getTimePole,
  getUserTimePole,
  getUserTimeline,
});
