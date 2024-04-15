import { put, takeLatest } from "redux-saga/effects";
import { StandardPoleData } from "../../../tools/utilities/timepoleUtils/timepoleUtils";

function* guestTimePoleSaga() {
  yield takeLatest("GET_CURRENT_GUEST", getCurrentGuest);

  //create
  yield takeLatest("CREATE_TIMEPOLE_GUEST", createTimePoleGUEST);

  //delete
  yield takeLatest("DELETE_TIMEPOLE_GUEST", deleteTimePoleGUEST);

  //update
  yield takeLatest("UPDATE_TIMEPOLE_GUEST", updateTimePoleGUEST);
  yield takeLatest(
    "UPDATE_COMPLETE_TIMEPOLE_GUEST",
    updateCompleteTimePoleGuest
  );

  // update sort data
  yield takeLatest("UPDATE_SORT_DATA_GUEST", updateSortDataGUEST);
}

function* getCurrentGuest({
  payload,
}: {
  payload: { year: string };
  type: string;
}) {
  // get sort data based off of url
  // create / generate data if not there

  /*

    {
        <year> : {
                    timelineId : year
                    poles: AllStandardPoles[]
                    sortData: string
                }
    }
     */

  const year = payload.year;
  // get guest data
  const guestData = window.localStorage.getItem("guestData");

  // check if guest data exist
  const parseGD = guestData ? JSON.parse(guestData) : {};

  // if exist -> return data
  if (!parseGD[year]) {
    // if doesn't -> initiate
    parseGD[year] = {
      timelineId: year,
      poles: [],
      sortData: {},
    };
  }

  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  yield put({
    type: "SET_CURRENT_USER_TIMEPOLE_ALL",
    payload: {
      timelineId: parseGD[year].timelineId,
      poles: parseGD[year].poles,
      sortData: [{ sort: parseGD[year].sortData }],
    },
  });
}

type PostTimePole = {
  payload: {
    id: number;
    year_id: string;

    title: string;
    description: string;
    completed: boolean;

    year: number;
    month: number;
    date: number;
    full_date: string;
  };
  type: string;
};

function* createTimePoleGUEST({ payload }: PostTimePole) {
  /*
    
    {
        id: string (random);
        year_id: string;
        
        title: string;
        description: string;
        completed: boolean (false default)

        year: number
        month: number
        date: number
        full_data: string

    }
    
    */
  // create timepole
  const newPole = payload;

  // update current data
  const GD = window.localStorage.getItem("guestData");
  const parseGD = JSON.parse(GD!);

  parseGD[newPole.year_id].poles.push(newPole);

  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  yield put({
    type: "SET_CURRENT_USER_TIMELINE_POLE",
    payload: { poles: parseGD[newPole.year_id].poles },
  });
  console.log(payload);
}

function* deleteTimePoleGUEST({
  payload,
}: {
  payload: { timelineId: string; id: string };
  type: string;
}) {
  const GD = window.localStorage.getItem("guestData");
  const parseGD = JSON.parse(GD!);

  const newPoles: StandardPoleData[] = [];

  for (let i = 0; i < parseGD[payload.timelineId].poles.length; i++) {
    if (parseGD[payload.timelineId].poles[i].id !== payload.id) {
      newPoles.push(parseGD[payload.timelineId].poles[i]);
    }
  }

  parseGD[payload.timelineId].poles = newPoles;

  //   window.localStorage.setItem("guestData", JSON.stringify(newPoles));
  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  yield put({
    type: "SET_CURRENT_USER_TIMELINE_POLE",
    payload: { poles: parseGD[payload.timelineId].poles },
  });
  //   console.log(JSON.stringify(newPoles));
}

function* updateTimePoleGUEST({ payload }: PostTimePole) {
  const GD = window.localStorage.getItem("guestData");
  const parseGD = JSON.parse(GD!);
  //   console.log(parseGD[payload.year_id].poles);
  for (let i = 0; i < parseGD[payload.year_id].poles.length; i++) {
    if (parseGD[payload.year_id].poles[i].id === payload.id) {
      console.log("test");
      parseGD[payload.year_id].poles[i] = {
        ...parseGD[payload.year_id].poles[i],
        title: payload.title,
        description: payload.description,

        date: payload.date,
        month: payload.month,
        year: payload.year,
        full_date: payload.full_date,
      };
    }
  }

  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  yield put({
    type: "SET_CURRENT_USER_TIMELINE_POLE",
    payload: { poles: parseGD[payload.year_id].poles },
  });
}

function* updateCompleteTimePoleGuest({
  payload,
}: {
  payload: { timelineId: string; id: string; state: boolean };
  type: string;
}) {
  const GD = window.localStorage.getItem("guestData");
  const parseGD = JSON.parse(GD!);
  //   console.log(parseGD[payload.year_id].poles);
  for (let i = 0; i < parseGD[payload.timelineId].poles.length; i++) {
    if (parseGD[payload.timelineId].poles[i].id === payload.id) {
      console.log("test");
      parseGD[payload.timelineId].poles[i] = {
        ...parseGD[payload.timelineId].poles[i],
        completed: payload.state,
      };
    }
  }

  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  yield put({
    type: "SET_CURRENT_USER_TIMELINE_POLE",
    payload: { poles: parseGD[payload.timelineId].poles },
  });
}

function* updateSortDataGUEST({
  payload,
}: {
  payload: { timelineId: string; sortData: string };
  type: string;
}) {
  const GD = window.localStorage.getItem("guestData");
  const parseGD = JSON.parse(GD!);

  parseGD[payload.timelineId].sortData = payload.sortData;

  window.localStorage.setItem("guestData", JSON.stringify(parseGD));

  //   yield put({
  //     type: "SET_CURRENT_USER_TIMELINE_POLE",
  //     payload: { poles: parseGD[payload.timelineId].poles },
  //   });
}
// function accessTimePole(){}
export default guestTimePoleSaga;
