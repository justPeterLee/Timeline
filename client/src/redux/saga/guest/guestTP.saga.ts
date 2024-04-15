import { put, takeLatest } from "redux-saga/effects";

function* guestTimePoleSaga() {
  yield takeLatest("GET_CURRENT_GUEST", getCurrentGuest);

  //create
  //   yield takeLatest("CREATE_TIMEPOLE_GUEST", createTimePoleGuest);

  //delete
  //update
  //markComplete
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
      sortData: [{ sort: parseGD.sort }],
    },
  });
}

function* createTimePoleGUEST({}) {
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
  // update current data
}
export default guestTimePoleSaga;
