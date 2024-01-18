import { normalizeArray } from "../assets/helpers/storesHelpers";
import { fetchPaginatedData } from "./paginations";

// Tag Actions
export const CREATE_TAG = "CREATE_TAG";
export const UPDATE_TAG = "UPDATE_TAG";
export const SET_TAGS = "posts/tags/SET_TAGS";
export const GET_POSTS_BY_TAG = "posts/GET_POSTS_BY_TAG";
export const SET_SELECTED_TAGS = "SET_SELECTED_TAGS";

// Action Creators
const actionSetTags = (tags) => ({
  type: SET_TAGS,
  tags,
});

const actionGetPostsByTag = (posts) => ({
  type: GET_POSTS_BY_TAG,
  posts,
});

export const actionCreateTag = (tag) => ({
  type: CREATE_TAG,
  tag,
});

export const actionUpdateTag = (tag) => ({
  type: UPDATE_TAG,
  tag,
});

export const actionSetSelectedTags = (tags) => ({
  type: SET_SELECTED_TAGS,
  payload: tags,
});
// Thunk to create a new tag
export const thunkCreateTag = (tagName) => async (dispatch) => {
  try {
    const response = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tagName }),
    });

    if (response.ok) {
      const newTag = await response.json();
      dispatch(actionCreateTag(newTag));
      return newTag;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error creating tag:", error);
  }
};

// Thunk to update a tag
export const thunkUpdateTag = (tagId, newTagName) => async (dispatch) => {
  try {
    const response = await fetch(`/api/tags/${tagId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName }),
    });

    if (!response.ok) {
      throw response;
    }

    const updatedTag = await response.json();
    dispatch(actionUpdateTag(updatedTag));
    return updatedTag;
  } catch (error) {
    console.error("Error updating tag:", error);
  }
};

// Thunk to Fetch All Tags
export const thunkGetAllTags = () => async (dispatch) => {
  try {
    const response = await fetch("/api/posts/tags");
    if (response.ok) {
      const data = await response.json();
      dispatch(actionSetTags(data.tags));
      return data.tags;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};

export const thunkGetPostsByTag = (tag, page, perPage) => {
  return fetchPaginatedData(
    `/api/posts/by_tag/${tag}`,
    [actionGetPostsByTag],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    ["posts"],
    "postsByTag"
  );
};

export const thunkGetPostsByTags = (tags, page, perPage) => {
  const queryParams = new URLSearchParams();
  tags.forEach((tag) => queryParams.append("tags", tag));
  queryParams.append("page", page);
  queryParams.append("per_page", perPage);

  return fetchPaginatedData(
    `/api/posts/by_tags?${queryParams.toString()}`,
    [actionGetPostsByTag],
    page,
    perPage,
    {},
    {},
    null,
    [true],
    ["posts"],
    "postsByTag"
  );
};

const initialState = {
  postsByTag: {
    byId: {},
    allIds: [],
    pagination: { currentPage: 1, totalPages: 1 },
  },
  allTags: [],
  selectedTags: [],
};

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        allTags: action.tags,
      };

    case GET_POSTS_BY_TAG:
      newState = { ...state, postsByTag: { byId: {}, allIds: [] } };
      newState.postsByTag = {
        byId: { ...newState.postsByTag.byId, ...action.posts.byId },
        allIds: [
          ...new Set([...newState.postsByTag.allIds, ...action.posts.allIds]),
        ],
      };
      return newState;

    case CREATE_TAG:
      return {
        ...state,
        allTags: [...state.allTags, action.tag],
      };
    case UPDATE_TAG:
      return {
        ...state,
        allTags: state.allTags.map((tag) =>
          tag.id === action.tag.id ? action.tag : tag
        ),
      };
    case SET_SELECTED_TAGS:
      return {
        ...state,
        selectedTags: action.payload,
      };
    default:
      return state;
  }
}
