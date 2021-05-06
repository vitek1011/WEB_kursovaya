import axios from "axios";

import { LOGIN, serverUrl, LOGOUT } from "../constants";
import { Dispatch } from "redux";
import { AppActions } from "../types";

export const login = (username: string) => async (
  dispatch: Dispatch<AppActions>
) => {
  try {
    const msg = await axios.post(
      serverUrl + "login",
      JSON.stringify({ username: username }),
      {
        withCredentials: true,
      }
    );

    return dispatch({ type: LOGIN, data: msg.data });
  } catch (err) {
    console.log(err);
  }
};

export const logout = (username: string) => async (
  dispatch: Dispatch<AppActions>
) => {
  try {
    await axios.post(
      serverUrl + "private/" + "delsessions",
      JSON.stringify({ username: username }),
      {
        withCredentials: true,
      }
    );

    return dispatch({ type: LOGOUT });
  } catch (err) {
    console.log(err);
  }
};

export const whoami = (username: string) => async (
  dispatch: Dispatch<AppActions>
) => {
  try {
    if (!document.cookie) {
      return;
    }

    const msg = await axios.post(
      serverUrl + "private/" + "whoami",
      JSON.stringify({ username: username }),
      {
        withCredentials: true,
      }
    );

    if (msg.status === 401) {
      return dispatch(logout(""));
    }
  } catch (err) {
    console.log(err);
  }
};
