import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
  const id = uuid.v4();
  //midleware funk
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  //Remova poruke
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
