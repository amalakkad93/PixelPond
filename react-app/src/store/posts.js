// import { normalizeArray, fetchPaginatedData } from "../assets/helpers/storesHelpers";
import { normalizeArray } from "../assets/helpers/storesHelpers";
import {
  fetchPaginatedData,
  actionSetCurrentPage,
  actionSetTotalPages,
} from "./paginations";
import { setLoading, setError } from "./ui";

/** Action type to handle fetching all posts */
const GET_ALL_POSTS = "posts/GET_ALL_POSTS";

/** Action type to handle fetching posts owned by a user */
const GET_OWNER_POSTS = "posts/GET_OWNER_POSTS";

/** Action type to handle fetching posts by a user ID */
const GET_POSTS_BY_USER_ID = "posts/GET_POSTS_BY_USER_ID";

const GET_LOGGED_IN_USER_POSTS = "posts/GET_LOGGED_IN_USER_POSTS";

/** Action type to handle fetching details of a single post */
const GET_SINGLE_POST = "posts/GET_SINGLE_POST";

const SET_USER_INFO = "SET_USER_INFO";

/** Action type to handle creating a new post */
const CREATE_POST = "posts/CREATE_POST";

/** Action type to handle updating a post */
const UPDATE_POST = "posts/UPDATE_POST";

/** Action type to handle deleting a post */
const DELETE_POST = "posts/DELETE_POST";

const SET_NEIGHBOR_POSTS = "posts/SET_NEIGHBOR_POSTS";

/** Action type to handle errors during post operations */
const SET_POST_ERROR = "posts/SET_POST_ERROR";

// Action Types
const SET_CURRENT_PAGE = "posts/SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "posts/SET_TOTAL_PAGES";

// Action Creators
export const setCurrentPagePost = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const setTotalPagesPost = (pages) => ({
  type: SET_TOTAL_PAGES,
  payload: pages,
});

/** Creates an action to set all available posts in the store */
const actionGetAllPosts = (posts) => ({
  type: GET_ALL_POSTS,
  posts,
});

/** Creates an action to get all the user available posts in the store */
// const actionGetPostsByUserId = (posts, userInfo) => ({
//   type: GET_POSTS_BY_USER_ID,
//   posts,
//   userInfo,
// });
const actionGetPostsByUserId = (normalizedPosts, userInfo) => ({
  type: GET_POSTS_BY_USER_ID,
  posts: normalizedPosts,
  userInfo,
});

const actionGetLoggedInUserPosts = (posts, userInfo) => ({
  type: GET_LOGGED_IN_USER_POSTS,
  posts,
  userInfo,
});

/** Creates an action to set details of a specific post in the store */
const actionGetSinglePost = (post) => ({
  type: GET_SINGLE_POST,
  post,
});

const actionSetNeighborPosts = (nextPostId, prevPostId) => ({
  type: SET_NEIGHBOR_POSTS,
  nextPostId,
  prevPostId,
});

const actionSetUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  userInfo,
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
  console.log("thunkGetAllPosts called", { page, perPage });
  return fetchPaginatedData(
    "/api/posts/all",
    [actionGetAllPosts],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    "posts",
    false
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
    "posts"
  );
};

// ***************************************************************
//  Thunk to Fetch Posts by a User ID With Pagination
// ***************************************************************
// export const thunkGetPostsByUserId = (userId, page, perPage) => {
//   return fetchPaginatedData(
//     `/api/posts/user/${userId}`,
//     // [(data) => actionGetPostsByUserId(data.user_posts)],
//     // [(data) => actionGetPostsByUserId(data.user_posts, data.user_info)],
//     [
//       (data) =>
//         actionGetPostsByUserId(normalizeArray(data.user_posts), data.user_info),
//     ],
//     page,
//     perPage,
//     {},
//     {},
//     null,
//     // [true],
//     [false],
//     "user_posts",
//     false
//   );
// };

// export const thunkGetPostsByUserId = (userId, page, perPage) => {
//   return fetchPaginatedData(
//     `/api/posts/user/${userId}`,
//     [
//       (normalizedPosts, userInfo) => actionGetPostsByUserId(normalizedPosts, userInfo)
//     ],
//     page,
//     perPage,
//     {},
//     {},
//     null,
//     // [true],
//     // [{ posts: true, userInfo: false }],
//     [['posts']], // Normalize only 'posts'

//     "user_posts",

//     false
//   );
// };
export const thunkGetPostsByUserId = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/posts/user/${userId}`,
    [
      // (posts, userInfo) => actionGetPostsByUserId(posts, userInfo)
      (normalizedPosts, data) =>
        actionGetPostsByUserId(normalizedPosts, data.user_info),
    ],
    page,
    perPage,
    {},
    {},
    null,
    [true], // Indicate to normalize 'posts'
    "user_posts"
  );
};

// ***************************************************************
//  Thunk to Fetch Posts by a User ID With Pagination
// ***************************************************************
export const thunkGetLoggedInUserPosts = (userId, page, perPage) => {
  return fetchPaginatedData(
    "/api/posts/current-user-posts",
    // [(data) => actionGetPostsByUserId(data.user_posts)],
    // [(data) => actionGetPostsByUserId(data.user_posts, data.user_info)],
    [
      (data) =>
        actionGetLoggedInUserPosts(
          normalizeArray(data.user_posts),
          data.user_info
        ),
    ],
    page,
    perPage,
    {},
    {},
    null,
    // [true],
    [false],
    "user_posts",
    false
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
      console.log(
        "🚀 ~ file: posts.js:164 ~ thunkGetPostDetails ~ post:",
        post
      );
      console.log(
        "🚀 ~ file: posts.js:164 ~ thunkGetPostDetails ~ post:",
        post.user_info
      );
      dispatch(actionGetSinglePost(post));
      if (post.user_info) {
        dispatch(actionSetUserInfo(post.user_info));
      }
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
//  Thunk to Fetch Neighbor Post IDs
// ***************************************************************
export const thunkGetNeighborPosts = (postId, userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/neighbors/${userId}`);
    if (response.ok) {
      const { next_post_id, prev_post_id } = await response.json();
      dispatch(actionSetNeighborPosts(next_post_id, prev_post_id));
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error fetching neighbor posts:", error);
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
      const post = await response.json();
      console.log("🚀 ~ file: posts.js:264 ~ thunkCreatePost ~  post:", post);
      dispatch(actionCreatePost(post));
      console.log("+++CREATE_POST dispatched with:", post);
      // dispatch(thunkGetPostsByUserId(post.owner_id, 1, 10));
      // return { type: "SUCCESS", data: post };
      return post;
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
      dispatch(actionUpdatePost(data));
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
  userInfo: {},
  neighborPosts: { nextPostId: null, prevPostId: null },
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
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
      console.log(
        "---Reducer - action payload for GET_POSTS_BY_USER_ID:",
        action
      ); // Log the action payload
      newState = {
        ...state,
        userPosts: { byId: {}, allIds: [] },
        userInfo: {},
        ownerPosts: { byId: {}, allIds: [] },
      };
      newState.userPosts = {
        byId: { ...newState.userPosts.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.userPosts.allIds, ...action.posts.allIds]),
        ],
      };
      newState.ownerPosts = {
        byId: { ...newState.ownerPosts.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.ownerPosts.allIds, ...action.posts.allIds]),
        ],
      };
      newState.userInfo = { ...action.userInfo };
      return newState;

    case GET_SINGLE_POST:
      newState = { ...state, singlePost: {} };
      newState.singlePost = action.post;
      return newState;

    case SET_NEIGHBOR_POSTS:
      return {
        ...state,
        neighborPosts: {
          nextPostId: action.nextPostId,
          prevPostId: action.prevPostId,
        },
      };

    case SET_USER_INFO:
      newState = { ...state, userInfo: {} };
      newState.userInfo = action.userInfo;
      return newState;

    case CREATE_POST:
      newState = { ...state };

      // New post ID
      const newPostId = action.post.id;

      // Update userPosts
      newState.userPosts.byId[newPostId] = action.post;
      newState.userPosts.allIds = [newPostId, ...newState.userPosts.allIds];
      console.log(
        "+++Updated userPosts after CREATE_POST:",
        newState.userPosts
      );

      // Update ownerPosts if the post is owned by the current user
      if (action.post.owner_id === state.userInfo.id) {
        newState.ownerPosts.byId[newPostId] = action.post;
        newState.ownerPosts.allIds = [newPostId, ...newState.ownerPosts.allIds];
      }

      // Optionally update allPosts if needed
      newState.allPosts.byId[newPostId] = action.post;
      newState.allPosts.allIds = [newPostId, ...newState.allPosts.allIds];

      return newState;

    //   case CREATE_POST:
    // newState = { ...state };
    // const newPostId = action.post.id;
    // newState.userPosts.byId[newPostId] = action.post;
    // newState.userPosts.allIds = [newPostId, ...newState.userPosts.allIds];
    // return newState;

    case UPDATE_POST:
      newState = { ...state };
      // Update in allPosts
      if (newState.allPosts.byId[action.post.id]) {
        newState.allPosts.byId[action.post.id] = action.post;
      }
      // Update in ownerPosts
      if (newState.ownerPosts.byId[action.post.id]) {
        newState.ownerPosts.byId[action.post.id] = action.post;
      }
      // Update in userPosts
      if (newState.userPosts.byId[action.post.id]) {
        newState.userPosts.byId[action.post.id] = action.post;
      }
      return newState;

    case SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, currentPage: action.payload },
      };
    case SET_TOTAL_PAGES:
      return {
        ...state,
        pagination: { ...state.pagination, totalPages: action.payload },
      };

    case DELETE_POST:
      newState = { ...state };
      const postIdToDelete = action.postId;

      // Remove the post from allPosts
      if (newState.allPosts.byId[postIdToDelete]) {
        delete newState.allPosts.byId[postIdToDelete];
        newState.allPosts.allIds = newState.allPosts.allIds.filter(
          (id) => id !== postIdToDelete
        );
      }

      // Remove the post from ownerPosts
      if (newState.ownerPosts.byId[postIdToDelete]) {
        delete newState.ownerPosts.byId[postIdToDelete];
        newState.ownerPosts.allIds = newState.ownerPosts.allIds.filter(
          (id) => id !== postIdToDelete
        );
      }

      // Remove the post from userPosts
      if (newState.userPosts.byId[postIdToDelete]) {
        delete newState.userPosts.byId[postIdToDelete];
        newState.userPosts.allIds = newState.userPosts.allIds.filter(
          (id) => id !== postIdToDelete
        );
      }

      return newState;
    default:
      return state;
  }
}
