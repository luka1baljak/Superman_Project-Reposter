import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  SEARCH_POSTS,
  CLEAR_POSTS,
  GET_MY_FEED,
  CHECK_FOR_NEW_POSTS
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  len: 0,
  lenAfterCheck: 0
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_POSTS:
      return {
        ...state,
        posts: payload.docs,
        loading: false,
        len: payload.total
      };
    case GET_POSTS:
      return {
        ...state,
        posts: state.posts.concat(payload.docs),
        loading: false,
        len: payload.total
      };
    case GET_MY_FEED:
      return {
        ...state,
        posts: state.posts.concat(payload.docs),
        loading: false,
        len: payload.total
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case CLEAR_POSTS:
      return {
        ...state,
        posts: [],
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment._id !== payload
          )
        },
        loading: false
      };
    case CHECK_FOR_NEW_POSTS:
      return {
        ...state,
        loading: false,
        lenAfterCheck: payload.total
      };
    default:
      return state;
  }
}
