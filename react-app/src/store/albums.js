import { normalizeArray } from "../assets/helpers/storesHelpers";
import { fetchPaginatedData } from "./paginations";
import { setLoading, setError } from "./ui";

// Action Types
export const GET_ALBUMS = "albums/GET_ALBUMS";
export const GET_ALBUM_IMAGES = "albums/GET_ALBUM_IMAGES";
export const GET_USER_INFO = "albums/GET_USER_INFO";
export const GET_ALBUMS_BY_USER_ID = "albums/GET_ALBUMS_BY_USER_ID";
export const CREATE_ALBUM = "albums/CREATE_ALBUM";
export const UPDATE_ALBUM = "albums/UPDATE_ALBUM";
export const ADD_POST_TO_ALBUM = "albums/ADD_POST_TO_ALBUM";
export const REMOVE_POST_FROM_ALBUM = "albums/REMOVE_POST_FROM_ALBUM";
const DELETE_ALBUM = "DELETE_ALBUM";

// Action Creators
export const actionGetAlbums = (albums) => ({
  type: GET_ALBUMS,
  albums,
});

export const actionGetAlbumImages = (albumId, imagesData, userId, albumTitle) => {
  const normalizedImages = normalizeArray(imagesData, "id");
  return {
    type: GET_ALBUM_IMAGES,
    payload: { albumId, images: normalizedImages, userId, albumTitle },
  };
};


export const actionGetAlbumsByUserId = (albums) => {
  const normalizedAlbums = albums.map((album) => {
    const normalizedImages = normalizeArray(album.images, "id");
    return {
      id: album.id,
      title: album.title,
      user_id: album.user_id,
      images: normalizedImages,
    };
  });

  return {
    type: GET_ALBUMS_BY_USER_ID,
    albums: normalizeArray(normalizedAlbums, "id"),
  };
};

export const actionGetUserInfo = (userInfo) => ({
  type: GET_USER_INFO,
  userInfo,
});

export const actionAddPostToAlbum = (updatedPost) => ({
  type: ADD_POST_TO_ALBUM,
  updatedPost,
});

export const actionRemovePostFromAlbum = (updatedPost) => ({
  type: REMOVE_POST_FROM_ALBUM,
  updatedPost,
});
export const actionCreateAlbum = (album) => ({
  type: CREATE_ALBUM,
  album,
});

export const actionUpdateAlbum = (updatedAlbum) => ({
  type: UPDATE_ALBUM,
  updatedAlbum,
});

export const actionDeleteAlbum = (albumId) => ({
  type: DELETE_ALBUM,
  albumId,
});

// Thunk to fetch album images with pagination
export const thunkGetAlbumImages = (albumId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/${albumId}`,
    [
      (data) => {
        const { images, user_id, title } = data;
        return actionGetAlbumImages(albumId, images, user_id, title);
      },
    ],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    ["images", "user_id", "title"]
  );
};

export const thunkGetAlbumsByUserId = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/user/${userId}`,
    [
      (data) => {
        console.log("-----Fetching albums for data:", data);
        return actionGetAlbumsByUserId(data.albums);
      },
    ],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    ["albums"]
  );
};

// ***************************************************************
// Thunk to Add Post to Album
// ***************************************************************
export const thunkAddPostToAlbum = (postId, albumId) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/posts/${postId}/add-to-album/${albumId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(actionAddPostToAlbum(updatedPost));
      return updatedPost;
    } else {
      const errors = await response.json();
      throw new Error(errors.error || "Error adding post to album");
    }
  } catch (error) {
    throw error;
  }
};

// Thunk to Remove Post from Album
export const thunkRemovePostFromAlbum =
  (postId, albumId) => async (dispatch) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/remove-from-album/${albumId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(actionRemovePostFromAlbum(updatedPost));
        return updatedPost;
      } else {
        const errors = await response.json();
        throw new Error(errors.error || "Error removing post from album");
      }
    } catch (error) {
      throw error;
    }
  };

// Thunk to Create an Album
export const thunkCreateAlbum =
  (albumData, currentPage, perPage) => async (dispatch) => {
    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData),
      });

      if (response.ok) {
        const newAlbum = await response.json();
        if (newAlbum && newAlbum.id) {
          dispatch(actionCreateAlbum(newAlbum));
          dispatch(
            thunkGetAlbumsByUserId(newAlbum.user_id, currentPage, perPage)
          );
          return { type: "SUCCESS", data: newAlbum };
        } else {
          console.error("Invalid album data received:", newAlbum);
          return { type: "FAILURE", error: "Invalid data received" };
        }
      } else {
        const errors = await response.json();
        return {
          type: "FAILURE",
          error: errors.message || "Error creating album",
        };
      }
    } catch (error) {
      console.error("Exception in thunkCreateAlbum:", error);
      return { type: "EXCEPTION", error: error.toString() };
    }
  };

// Thunk to Update an Album
export const thunkUpdateAlbum = (albumId, updatedData, currentPage, perPage) => async (dispatch) => {
  try {
    const response = await fetch(`/api/albums/${albumId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedAlbum = await response.json();
      dispatch(actionUpdateAlbum(updatedAlbum));
      // dispatch(actionGetAlbumsByUserId(updatedAlbum.user_id, currentPage, perPage));
      return { type: "SUCCESS", data: updatedAlbum };
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    // handle errors
    return { type: "FAILURE", error };
  }
};

export const thunkDeleteAlbum = (albumId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/albums/${albumId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(actionDeleteAlbum(albumId));
      return { type: "SUCCESS", data: albumId };
    } else {
      const errors = await response.json();
      return {
        type: "FAILURE",
        error: errors.error || "Error deleting album",
      };
    }
  } catch (error) {
    console.error("Exception in thunkDeleteAlbum:", error);
    return { type: "EXCEPTION", error: error.toString() };
  }
};

// Initial State
const initialState = {
  allAlbums: { byId: {}, allIds: [] },
  ownerAlbums: { byId: {}, allIds: [] },
  singleAlbum: { byId: {}, allIds: [] },
  userAlbums: { byId: {}, allIds: [] },
  userInfo: {},
};

// Reducer
export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALBUMS:
      newState = { ...state, allAlbums: { byId: {}, allIds: [] } };
      newState.allAlbums = {
        byId: { ...action.albums.byId },
        allIds: [...action.albums.allIds],
      };
      return newState;

    case GET_ALBUM_IMAGES:
      const { albumId, images, userId, albumTitle } = action.payload;
      return {
        ...state,
        singleAlbum: {
          ...state.singleAlbum,
          byId: {
            ...state.singleAlbum.byId,
            [albumId]: {
              images: images.byId,
              imageIds: images.allIds,
              userId: userId,
              title: albumTitle,
            },
          },
          allIds: state.singleAlbum.allIds.includes(albumId)
            ? state.singleAlbum.allIds
            : [...state.singleAlbum.allIds, albumId],
        },
      };

    case GET_ALBUMS_BY_USER_ID:
      console.log("-----Updating state with new albums:", action.albums);

      return {
        ...state,
        userAlbums: action.albums,
      };

    case ADD_POST_TO_ALBUM: {
      // const { updatedPost } = action;
      const updatedPost = action.updatedPost;

      if (!updatedPost || !updatedPost.album_id) {
        console.error("Invalid data for ADD_POST_TO_ALBUM:", updatedPost);
        return state;
      }
      newState = { ...state };
      if (newState.allAlbums.byId[updatedPost.album_id]) {
        newState.allAlbums.byId[updatedPost.album_id].imageIds = [
          ...newState.allAlbums.byId[updatedPost.album_id].imageIds,
          updatedPost.image_id,
        ];
      }
      return newState;
    }

    case REMOVE_POST_FROM_ALBUM: {
      const updatedPost = action.updatedPost;

      if (updatedPost && updatedPost.album_id) {
        newState = { ...state };

        const albumId = updatedPost.album_id;

        if (newState.allAlbums.byId[albumId]) {
          newState.allAlbums.byId[albumId].imageIds = newState.allAlbums.byId[
            albumId
          ].imageIds.filter((imageId) => imageId !== updatedPost.image_id);
        }

        if (newState.singleAlbum.byId[albumId]) {
          newState.singleAlbum.byId[albumId].imageIds =
            newState.singleAlbum.byId[albumId].imageIds.filter(
              (imageId) => imageId !== updatedPost.image_id
            );
        }

        return newState;
      }
      return state;
    }

    case CREATE_ALBUM:
      if (action.album && action.album.id) {
        newState = { ...state };
        newState.allAlbums.byId[action.album.id] = action.album;
        newState.allAlbums.allIds = [
          ...state.allAlbums.allIds,
          action.album.id,
        ];
        return newState;
      } else {
        console.error("Album data is missing or invalid:", action.album);
        return state;
      }

      case UPDATE_ALBUM: {
        const updatedAlbum = action.updatedAlbum;

        newState = { ...state };

        if (newState.allAlbums.byId[updatedAlbum.id]) {
          newState.allAlbums.byId[updatedAlbum.id] = updatedAlbum;
        }

        if (newState.ownerAlbums.byId[updatedAlbum.id]) {
          newState.ownerAlbums.byId[updatedAlbum.id] = updatedAlbum;
        }

        if (newState.userAlbums.byId[updatedAlbum.id]) {
          newState.userAlbums.byId[updatedAlbum.id] = updatedAlbum;
        }

        if (newState.singleAlbum.byId[updatedAlbum.id]) {
          newState.singleAlbum.byId[updatedAlbum.id] = updatedAlbum;
        }

        return newState;
      }

    case DELETE_ALBUM: {
      const albumId = action.albumId;
      newState = { ...state };

      // Delete album from allAlbums
      delete newState.allAlbums.byId[albumId];
      newState.allAlbums.allIds = newState.allAlbums.allIds.filter(
        (id) => id !== albumId
      );

      // Delete album from userAlbums
      delete newState.userAlbums.byId[albumId];
      newState.userAlbums.allIds = newState.userAlbums.allIds.filter(
        (id) => id !== albumId
      );

      // Delete album from ownerAlbums if exists
      delete newState.ownerAlbums.byId[albumId];
      newState.ownerAlbums.allIds = newState.ownerAlbums.allIds.filter(
        (id) => id !== albumId
      );

      // Reset singleAlbum if it's the deleted album
      if (newState.singleAlbum.byId[albumId]) {
        delete newState.singleAlbum.byId[albumId];
        newState.singleAlbum.allIds = newState.singleAlbum.allIds.filter(
          (id) => id !== albumId
        );
      }
      return newState;
    }

    case GET_USER_INFO:
      newState = { ...state, userInfo: {} };
      newState.userInfo = { ...action.userInfo };
      return newState;

    default:
      return state;
  }
}
