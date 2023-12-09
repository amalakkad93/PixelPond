// import { normalizeArray, fetchPaginatedData } from "../assets/helpers/storesHelpers";
import { normalizeArray } from "../assets/helpers/storesHelpers";
import { fetchPaginatedData } from "./paginations";
import { setLoading, setError } from "./ui";

/** Action type to handle fetching all posts */
const GET_ALL_POSTS = "posts/GET_ALL_POSTS";

/** Action type to handle fetching posts owned by a user */
const GET_OWNER_POSTS = "posts/GET_OWNER_POSTS";

/** Action type to handle fetching posts by a user ID */
const GET_POSTS_BY_USER_ID = "posts/GET_POSTS_BY_USER_ID";

/** Action type to handle fetching details of a single post */
const GET_SINGLE_POST = "posts/GET_SINGLE_POST";

/** Action type to handle creating a new post */
const CREATE_POST = "posts/CREATE_POST";

/** Action type to handle updating a post */
const UPDATE_POST = "posts/UPDATE_POST";

/** Action type to handle deleting a post */
const DELETE_POST = "posts/DELETE_POST";

/** Action type to handle errors during post operations */
const SET_POST_ERROR = "posts/SET_POST_ERROR";

/** Creates an action to set all available posts in the store */
const actionGetAllPosts = (posts) => ({
  type: GET_ALL_POSTS,
  posts,
});

/** Creates an action to get all the user available posts in the store */
const actionGetPostsByUserId = (posts) => ({
  type: GET_POSTS_BY_USER_ID,
  posts,
});

/** Creates an action to set details of a specific post in the store */
const actionGetSinglePost = (post) => ({
  type: GET_SINGLE_POST,
  post,
});

/** Creates an action to set posts owned by a user in the store */
const actionGetOwnerPosts = (posts) => ({
  type: GET_OWNER_POSTS,
  posts,
});

/** Creates an action to handle creating a new post */
const actionCreatePost = (post) => ({
  type: CREATE_POST,
  post,
});

/** Creates an action to handle updating a post */
const actionUpdatePost = (post) => ({
  type: UPDATE_POST,
  post,
});

/** Creates an action to handle deleting a post */
const actionDeletePost = (postId) => ({
  type: DELETE_POST,
  postId,
});

/** Creates an action to handle errors during post operations */
const actionSetPostError = (errorMessage) => ({
  type: SET_POST_ERROR,
  payload: errorMessage,
});

// =========================================================
//                   ****Thunks****
// =========================================================
// Thunks allow Redux to handle asynchronous operations.
// Instead of returning action objects directly, they return a function that can dispatch multiple actions.

// ***************************************************************
//  Thunk to Fetch All Posts With Pagination
// ***************************************************************
export const thunkGetAllPosts = (page, perPage) => {
  return fetchPaginatedData(
    "/api/posts/all",
    [actionGetAllPosts],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    'posts'
  );
};

// ***************************************************************
//  Thunk to Fetch Posts Owned by a User With Pagination
// ***************************************************************
export const thunkGetOwnerPosts = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/posts/owner/${userId}`,
    [actionGetOwnerPosts],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    'ownerPosts'
  );
};

// ***************************************************************
//  Thunk to Fetch Posts by a User ID With Pagination
// ***************************************************************
// Thunk to fetch posts by a user ID with pagination
export const thunkGetPostsByUserId = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/posts/user/${userId}`,
    [actionGetPostsByUserId],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    'user_posts'
  );
};

// ***************************************************************
//  Thunk to Fetch Details of a Specific Post
// ***************************************************************
export const thunkGetPostDetails = (postId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(`/api/posts/${postId}`);

    if (response.ok) {
      const post = await response.json();
      dispatch(actionGetSinglePost(post));
      return post;
    } else {
      const errors = await response.json();
      dispatch(
        setError(errors.message || `Error fetching post with ID ${postId}.`)
      );
    }
  } catch (error) {
    dispatch(
      setError(
        `An error occurred while fetching post with ID ${postId}: ${error}`
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// ***************************************************************
//  Thunk to Create a New Post
// ***************************************************************
export const thunkCreatePost = (postData) => async (dispatch) => {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(actionCreatePost(data.entities.posts));
      return { type: "SUCCESS", data };
    } else {
      const errors = await response.json();
      dispatch(actionSetPostError(errors.error || "Error creating post."));
      throw errors;
    }
  } catch (error) {
    dispatch(actionSetPostError("An error occurred while creating the post."));
    throw error;
  }
};

// ***************************************************************
//  Thunk to Update a Post
// ***************************************************************

export const thunkUpdatePost = (postId, updatedData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(actionUpdatePost(data.entities.posts));
      return { type: "SUCCESS", data };
    } else {
      const errors = await response.json();
      dispatch(
        actionSetPostError(
          errors.error || `Error updating post with ID ${postId}.`
        )
      );
      throw errors;
    }
  } catch (error) {
    dispatch(
      actionSetPostError(
        `An error occurred while updating post with ID ${postId}.`
      )
    );
    throw error;
  }
};

// ***************************************************************
//  Thunk to Delete a Post
// ***************************************************************

export const thunkDeletePost = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();

      // Dispatch the action to update the Redux state after a successful deletion
      dispatch(actionDeletePost(postId));

      return { type: "SUCCESS" };
    } else {
      const errors = await response.json();
      dispatch(actionSetPostError(errors.error || "Error deleting post."));
      throw errors;
    }
  } catch (error) {
    dispatch(
      actionSetPostError(
        `An error occurred while deleting the post with ID ${postId}.`
      )
    );
    throw error;
  }
};

// =========================================================
//                   ****Reducer****
// =========================================================
// The reducer calculates the new state based on the previous state and the dispatched action.
// It's a pure function, meaning it doesn't produce side effects and will always return the same output for the same input.

const initialState = {
  allPosts: { byId: {}, allIds: [] },
  ownerPosts: { byId: {}, allIds: [] },
  userPosts: { byId: {}, allIds: [] },
  singlePost: {},
};

/**
 * Reducer function for post-related operations in the Redux store.
 * @param {Object} state - The current state of the posts in the store.
 * @param {Object} action - An action object containing the type and payload.
 * @returns {Object} The updated state after applying the action.
 */
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_POSTS:
      newState = { ...state, allPosts: { byId: {}, allIds: [] } };
      newState.allPosts = {
        byId: { ...newState.allPosts.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.allPosts.allIds, ...action.posts.allIds]),
        ],
      };
      return newState;

    case GET_OWNER_POSTS:
      newState = { ...state, ownerPosts: { byId: {}, allIds: [] } };
      newState.ownerPosts = {
        byId: { ...newState.ownerPosts.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.ownerPosts.allIds, ...action.posts.allIds]),
        ],
      };
      return newState;

    case GET_POSTS_BY_USER_ID:
      newState = { ...state, userPosts: { byId: {}, allIds: [] } };
      newState.userPosts = {
        byId: { ...newState.userPosts.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.userPosts.allIds, ...action.posts.allIds]),
        ],
      };
      return newState;

    case GET_SINGLE_POST:
      newState = { ...state, singlePost: {} };
      newState.singlePost = action.post;
      return newState;

    // case CREATE_POST:
    // // ...

    // case UPDATE_POST:
    // // ...

    // case DELETE_POST:
    // // ...

    default:
      return state;
  }
}
