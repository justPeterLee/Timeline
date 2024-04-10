import { combineReducers } from "redux";
import { AllStandardPoleData } from "../../tools/utilities/timepoleUtils/timepoleUtils";
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

interface CurrentTimePole {
  status: "not loaded" | "completed";
  poles: AllStandardPoleData[];
  sortData: string;
}
function currentUserTimePole(
  state: CurrentTimePole = { status: "not loaded", poles: [], sortData: "{}" },
  action: action
) {
  switch (action.type) {
    case "SET_CURRENT_USER_TIMEPOLE":
      // return {
      //   ...state,
      //   status: "completed",
      //   poles: action.payload.poles,
      //   sortData: action.payload.sortData,
      // };
      console.log(action.payload);
      return state;
    default:
      return state;
  }
}
export default combineReducers({
  getTimePole,
  getUserTimePole,
  getUserTimeline,

  currentUserTimePole,
});
