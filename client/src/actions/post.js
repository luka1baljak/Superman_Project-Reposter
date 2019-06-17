import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  SEARCH_POSTS,
  CLEAR_POSTS,
  GET_MY_FEED,
  CHECK_FOR_NEW_POSTS,
  CHECK_FOR_NEW_POSTS_FEED
} from './types';

//get posts za main feed
export const getPosts = (offset, perPage) => async dispatch => {
  if (offset === 0) {
    dispatch({ type: CLEAR_POSTS });
  }
  try {
    const res = await axios.get(`/api/posts?offset=${offset}&limit=${perPage}`);

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//Checks if new posts exist
export const checkForNewPosts = () => async dispatch => {
  try {
    const res = await axios.get(`/api/posts`);

    dispatch({
      type: CHECK_FOR_NEW_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Dohvaćanje postova od odeđenog usera
export const getUsersPosts = (user_id, offset, limit) => async dispatch => {
  if (offset === 0) {
    dispatch({ type: CLEAR_POSTS });
  }
  try {
    const res = await axios.get(
      `/api/posts/user_posts/${user_id}?offset=${offset}&limit=${limit}`
    );

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Search posts by hash tag
export const searchPosts = search => async dispatch => {
  dispatch({ type: CLEAR_POSTS });

  try {
    const keyWord = search.toLowerCase();
    if (!keyWord) {
      const res = await axios.get(`/api/posts`);

      dispatch({
        type: SEARCH_POSTS,
        payload: res.data
      });
    }

    const res = await axios.get(`/api/search/posts/q=${keyWord}`);

    dispatch({
      type: SEARCH_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
//Postovi za moj Feed
export const getMyFeed = (offset, limit) => async dispatch => {
  if (offset === 0) {
    dispatch({ type: CLEAR_POSTS });
  }
  try {
    const res = await axios.get(
      `/api/posts/myfeed/posts?offset=${offset}&limit=${limit}`
    );

    dispatch({
      type: GET_MY_FEED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
export const checkForNewPostsFeed = () => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/myfeed/posts`);

    dispatch({
      type: CHECK_FOR_NEW_POSTS_FEED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Add like
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Remove likes
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id
    });

    dispatch(setAlert('Post uklonjen', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Add post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(`/api/posts/`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post napravljen', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//get a post
export const getPost = id => async dispatch => {
  dispatch({
    type: CLEAR_POSTS
  });
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });

    dispatch(setAlert('Komentar je dodan', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert('Komentar uklonjen', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};
