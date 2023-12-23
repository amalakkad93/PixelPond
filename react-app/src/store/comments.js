import { normalizeArray } from "../assets/helpers/storesHelpers";
import {
  fetchPaginatedData,
  actionSetCurrentPage,
  actionSetTotalPages,
} from "./paginations";
import { setLoading, setError } from "./ui";

// Action types for fetching comments
const GET_COMMENTS = " comments/GET_COMMENTS";

const ADD_COMMENT = "comments/ADD_COMMENT";
const EDIT_COMMENT = "comments/EDIT_COMMENT";
/** Action type to handle errors during post operations */
const SET_COMMENT_ERROR = "comments/SET_COMMENT_ERROR";

// Action creator to set comments in the store
const actionGetComments = (comments, postId) => ({
  type: GET_COMMENTS,
  comments,
  postId,
});

const actionAddComment = (comment) => ({
  type: ADD_COMMENT,
  comment,
});

const actionEditComment = (comment) => ({
  type: EDIT_COMMENT,
  comment,
});

/** Creates an action to handle errors during comments operations */
const actionSetPostError = (errorMessage) => ({
  type: SET_COMMENT_ERROR,
  payload: errorMessage,
});

// Thunk to fetch comments for a specific post with pagination
export const thunkGetPostComments = (postId, page, perPage) => {
  return fetchPaginatedData(
    `/api/posts/${postId}/comments`,
    [(data) => actionGetComments(normalizeArray(data.comments), postId)],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    ["comments"]
  );
};

export const thunkAddComment = (postId, content) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: content })
    });
    if (response.ok) {
      const comment = await response.json();


      const userInfoResponse = await fetch(`/api/users/${comment.user_id}`);
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        comment.user_info = userInfo;
      }

      dispatch(actionAddComment(comment));
    } else {
      const errors = await response.json();
      dispatch(actionSetPostError(errors.error || "Error creating comment."));
      throw errors;
    }
  } catch (error) {
    dispatch(actionSetPostError("An error occurred while creating the comment."));
    throw error;
  }
};






export const thunkEditComment =
  (commentId, commentData) => async (dispatch) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
      if (response.ok) {
        const comment = await response.json();
        dispatch(actionEditComment(comment));
      } else {
        const errors = await response.json();
        dispatch(actionSetPostError(errors.error || "Error creating post."));
        throw errors;
      }
    } catch (error) {
      dispatch(
        actionSetPostError("An error occurred while creating the post.")
      );
      throw error;
    }
  };

const initialState = {
  // comments: {},
  allCommentsOfPost: { byId: {}, allIds: [] },
};
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_COMMENTS:
      newState = { ...state, allCommentsOfPost: { byId: {}, allIds: [] } };
      newState.allCommentsOfPost = {
        byId: { ...newState.allCommentsOfPost.byId, ...action.comments.byId },
        allIds: [
          ...new Set([
            ...newState.allCommentsOfPost.allIds,
            ...action.comments.allIds,
          ]),
        ],
      };
      return newState;

    case ADD_COMMENT:
      newState = { ...state };
      newState.allCommentsOfPost.byId[action.comment.id] = action.comment;
      newState.allCommentsOfPost.allIds.push(action.comment.id);
      return newState;
    case EDIT_COMMENT:
      newState = { ...state };
      newState.allCommentsOfPost.byId[action.comment.id] = action.comment;
      return newState;
    default:
      return state;
  }
}
