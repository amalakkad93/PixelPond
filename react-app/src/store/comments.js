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
const GET_COMMENT_DETAIL = "comments/GET_COMMENT_DETAIL";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

const CLEAR_SINGLE_COMMENT = "comments/CLEAR_SINGLE_COMMENT";
const CLEAR_COMMENTS = "comments/CLEAR_COMMENTS";

const SET_COMMENT_ERROR = "comments/SET_COMMENT_ERROR";

// Action creator to set comments in the store
const actionGetComments = (comments, postId) => ({
  type: GET_COMMENTS,
  comments,
  postId,
});

export const actionAddComment = (comment) => ({
  type: ADD_COMMENT,
  comment,
});

const actionEditComment = (comment) => ({
  type: EDIT_COMMENT,
  comment,
});

const actionGetCommentDetail = (comment) => ({
  type: GET_COMMENT_DETAIL,
  comment,
});

const actionDeleteComment = (commentId) => ({
  type: DELETE_COMMENT,
  commentId,
});

const actionClearSingleComment = () => ({
  type: CLEAR_SINGLE_COMMENT,
});

export const actionClearComments = () => ({
  type: CLEAR_COMMENTS
});

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

export const thunkAddComment = (postId, commentData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      const newComment = await response.json();
      dispatch(actionAddComment(newComment));
      return newComment;
    } else {
      const errors = await response.json();
      dispatch(actionSetPostError(errors.error || "Error creating comment."));
      throw errors;
    }
  } catch (error) {
    dispatch(
      actionSetPostError("An error occurred while creating the comment.")
    );
    throw error;
  }
};

export const thunkEditComment =
  (postId, commentId, commentData) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        const comment = await response.json();
        dispatch(actionEditComment(comment));
        return comment;
      } else {
        const errors = await response.json();
        dispatch(actionSetPostError(errors.error || "Error updating comment."));
        throw errors;
      }
    } catch (error) {
      dispatch(
        actionSetPostError("An error occurred while updating the comment.")
      );
      throw error;
    }
  };

export const thunkGetCommentDetail =
  (postId, commentId) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}`
      );

      if (response.ok) {
        const commentDetail = await response.json();
        dispatch(actionGetCommentDetail(commentDetail));
        return commentDetail;
      } else {
        const error = await response.json();
        dispatch(
          actionSetPostError(error.message || "Error fetching comment detail.")
        );
      }
    } catch (error) {
      dispatch(
        actionSetPostError("An error occurred while fetching comment detail.")
      );
    }
  };

export const thunkDeleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(actionDeleteComment(commentId));
    } else {
      const error = await response.json();
      dispatch(actionSetPostError(error.error || "Error deleting comment."));
    }
  } catch (error) {
    dispatch(
      actionSetPostError("An error occurred while deleting the comment.")
    );
  }
};

const initialState = {
  allCommentsOfPost: { byId: {}, allIds: [] },
  singleComment: null,
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
      const commentId = String(action.comment.id);
      if (!newState.allCommentsOfPost.byId[commentId]) {
        newState.allCommentsOfPost.byId[commentId] = action.comment;

        if (!newState.allCommentsOfPost.allIds.includes(commentId)) {
          newState.allCommentsOfPost.allIds.unshift(commentId);
        }
      }
      return newState;

    case EDIT_COMMENT:
      newState = { ...state };
      newState.allCommentsOfPost.byId[action.comment.id] = action.comment;
      return newState;

    case GET_COMMENT_DETAIL:
      return {
        ...state,
        singleComment: action.comment,
      };

    case DELETE_COMMENT:
      newState = { ...state };
      delete newState.allCommentsOfPost.byId[action.commentId];
      newState.allCommentsOfPost.allIds =
        newState.allCommentsOfPost.allIds.filter(
          (id) => id !== action.commentId
        );
      return newState;

    case CLEAR_SINGLE_COMMENT:
      return {
        ...state,
        singleComment: null,
      };
      case CLEAR_COMMENTS:
        return {
          ...state,
          allCommentsOfPost: { byId: {}, allIds: [] }
        };
    default:
      return state;
  }
}
