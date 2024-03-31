import { store } from "../../redux/store";
import { redirect, json } from "react-router-dom";
import axios from "axios";
import { current } from "../data/monthData";

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
    const normalYear = year ? year : current.year.toString();
    store.dispatch({
      type: "GET_TIMEPOLE_YEAR_SERVER",
      payload: { year: normalYear },
    });
  } catch (err: any) {
    throw json(
      { message: "Error occured while fetching data" },
      { status: err.status }
    );
  }
}