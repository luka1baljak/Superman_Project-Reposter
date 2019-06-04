import {
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_PROFILES,
  SEARCH_PROFILES,
  CLEAR_PROFILES,
  ADD_FOLLOWER,
  REMOVE_FOLLOWER
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_PROFILES:
      return {
        ...state,
        profiles: payload.docs,
        loading: false,
        len: payload.total
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: state.profiles.concat(payload.docs),
        loading: false,
        len: payload.total
      };
    case ADD_FOLLOWER:
      return {
        ...state,
        profile: { ...state.profile, followers: payload.profile.followers },
        loading: false
      };
    case REMOVE_FOLLOWER:
      return {
        ...state,
        profile: { ...state.profile, followers: payload.profile.followers },
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    case CLEAR_PROFILES:
      return {
        ...state,
        profiles: [],
        loading: false
      };
    default:
      return state;
  }
}
