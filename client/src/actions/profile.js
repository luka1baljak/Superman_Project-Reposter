import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_PROFILES,
  SEARCH_PROFILES,
  CLEAR_PROFILES,
  ADD_FOLLOWER,
  REMOVE_FOLLOWER
} from './types';

// get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Search profiles by name
export const searchProfiles = search => async dispatch => {
  dispatch({ type: CLEAR_PROFILES });
  try {
    const res = await axios.get(`/api/search/profiles/q=${search}`);

    dispatch({
      type: SEARCH_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Get all profiles
export const getProfiles = (page, perPage) => async dispatch => {
  if (page === 1) {
    dispatch({ type: CLEAR_PROFILES });
  }
  try {
    const res = await axios.get(`/api/profile?page=${page}&perPage=${perPage}`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Get profile by ID
export const getProfileById = userId => async dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(
      setAlert(edit ? 'Profil je prepravljen ' : 'Profil napravljen', 'success')
    );

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

export const deleteAccount = () => async dispatch => {
  if (window.confirm('Da li ste sigurni da želite izbrisati svoj account?')) {
    try {
      await axios.delete('api/profile');

      dispatch({
        type: CLEAR_PROFILE
      });
      dispatch({
        type: ACCOUNT_DELETED
      });

      dispatch(setAlert('Vaš account je trajno uklonjen'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { mgs: err.response.statusText, status: err.response.status }
      });
    }
  }
};

//Add follower
export const addFollower = id => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/follow/${id}`);
    dispatch({
      type: ADD_FOLLOWER,
      payload: { id, profile: res.data }
    });
    dispatch(setAlert('Počeli ste pratiti ovog korisnika!', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Remove follower
export const removeFollower = id => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/unfollow/${id}`);
    dispatch({
      type: REMOVE_FOLLOWER,
      payload: { id, profile: res.data }
    });
    dispatch(setAlert('Prestali ste pratiti ovog korisnika!', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
