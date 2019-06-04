import axios from "axios";
import { setAlert } from "./alert";
import {UPDATE_USER_FAIL, UPDATE_USER_SUCCESS} from "./types";

export const updateUser = ({name,avatar}) => async dispatch => {
    
    const fd = new FormData();
    fd.append("name",name);

    if(avatar!==undefined){
      fd.append("avatar",avatar);
    }
    try {
        const res = await axios.put("/api/users", fd);
    
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: res.data
        });
    
       // dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
    
        dispatch({
          type: UPDATE_USER_FAIL
        });
    }
};