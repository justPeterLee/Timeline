import { combineReducers } from "redux";
import {
  AllStandardPoleData,
  TimelinePole,
} from "../../tools/utilities/timepoleUtils/timepoleUtils";
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

type Timeline = { status: "not loaded"; poles: TimelinePole[] };

function userTimeline(
  state: Timeline = { status: "not loaded", poles: [] },
  action: { payload: TimelinePole[]; type: string }
) {
  switch (action.type) {
    case "SET_USER_TIMELINE":
      // state = { ...state, status: "loading" };

      // for (let i = 0; i < action.payload.length; i++) {
      //   state = { ...state, [action.payload[i].year]: action.payload[i].id };
      // }

      // state = { ...state, status: "completed" };

      return { ...state, status: "completed", poles: [...action.payload] };
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
  state: CurrentTimePole = {
    status: "not loaded",
    poles: [],
    sortData: JSON.stringify({}),
  },
  action: {
    payload: { poles: AllStandardPoleData[]; sortData: { sort: string }[] };
    type: string;
  }
) {
  switch (action.type) {
    case "SET_CURRENT_USER_TIMEPOLE_ALL":
      console.log(action.payload);
      return {
        ...state,
        status: "completed",
        poles: action.payload.poles,
        sortData: action.payload.sortData.length
          ? action.payload.sortData[0].sort
          : JSON.stringify({}),
      };

    case "SET_CURRENT_USER_TIMELINE_POLE":
      console.log(action.payload);
      return { ...state, poles: action.payload.poles };

    case "SET_CURRENT_USER_TIMELINE_SORTDATA":
      console.log(action.payload);
      return {
        ...state,
        sortData: action.payload.sortData.length
          ? action.payload.sortData[0].sort
          : JSON.stringify({}),
      };

    default:
      return state;
  }
}
export default combineReducers({
  getTimePole,
  getUserTimePole,
  userTimeline,

  currentUserTimePole,
});
