// import { combineSlices } from "@reduxjs/toolkit";

interface action {
  type: string;
  payload: any;
}

const userReducer = (state = {}, action: action) => {
  switch (action.type) {
    case "SET_USER":
      console.log("in redux", action.payload);
      return action.payload;
    case "UNSET_USER":
      return {};
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
