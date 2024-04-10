import { store } from "../../redux/store";
import { redirect, json } from "react-router-dom";
import axios from "axios";
import { current } from "../data/monthData";

export async function userLoader() {
  try {
    store.dispatch({ type: "FETCH_USER" });
  } catch (err: any) {
    throw json(
      { message: "Error occured while fetching user" },
      { status: err.status }
    );
  }
}

export async function rescrictedURL(url: string) {
  try {
    let user = await axios.get("/api/v1/userAction");
    if (!user) {
      throw redirect(url);
    }
  } catch (err) {
    throw redirect(url);
  }
}

export async function requireUser() {
  let user = await axios.get("/api/v1/userAction");

  if (!user) {
    console.log("no users");
  }

  return user;
}

export async function redirectURL() {
  try {
    let user = await axios.get("/api/v1/userAction");
    return user;
  } catch (err) {
    return null;
  }
}

export async function yearLoader(year: string | undefined) {
  try {
    const user = await redirectURL();
    const normalYear = year ? year : current.year.toString();
    // const user = store.getState().userAccount;

    if (user) {
      store.dispatch({ type: "GET_TIMELINE_SERVER" });
      store.dispatch({
        type: "GET_TIMEPOLE_YEAR_SERVER",
        payload: { year: normalYear },
      });
    }
  } catch (err: any) {
    throw json(
      { message: "Error occured while fetching data" },
      { status: err.status }
    );
  }
}

export async function poleLoader() {
  try {
    store.dispatch({
      type: "GET_USER_TIMEPOLE",
    });
  } catch (err: any) {
    throw json({ message: "Error getting time poles" }, { status: err.status });
  }
}
