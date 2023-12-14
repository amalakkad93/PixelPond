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

// Action Creators
export const actionGetAlbums = (albums) => ({
  type: GET_ALBUMS,
  albums,
});

// Action creator for album images
export const actionGetAlbumImages = (data) => {
  const { images, album_info } = data;
  return {
    type: GET_ALBUM_IMAGES,
    images: images.byId ? images : normalizeArray(images),
    albumInfo: album_info,
  };
};

// Action creator for albums by user id
export const actionGetAlbumsByUserId = (albums) => {
  const normalizedAlbums = albums.map((album) => {
    // Normalize the images for each album
    const normalizedImages = normalizeArray(album.images, "id");

    return {
      ...album.album_info,
      images: normalizedImages,
    };
  });

  // Normalize the albums structure
  return {
    type: GET_ALBUMS_BY_USER_ID,
    albums: normalizeArray(normalizedAlbums, "id"),
  };
};

// Action Creator for user info
export const actionGetUserInfo = (userInfo) => ({
  type: GET_USER_INFO,
  userInfo,
});

export const actionCreateAlbum = (album) => ({
  type: CREATE_ALBUM,
  album,
});

export const actionUpdateAlbum = (album) => ({
  type: UPDATE_ALBUM,
  album,
});

// Thunk to fetch album images with pagination
export const ThunkGetAlbumImages = (albumId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/${albumId}`,
    [(data) => actionGetAlbumImages(data)],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    // [true],
    "images"
  );
};

export const thunkGetAlbumsByUserId = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/user/${userId}`,
    [(data) => actionGetAlbumsByUserId(data.albums)],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    // [true],
    "albums"
  );
};

// Thunk to Create an Album
export const thunkCreateAlbum = (albumData) => async (dispatch) => {
  try {
    const response = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(albumData),
    });

    if (response.ok) {
      const newAlbum = await response.json();
      dispatch(actionCreateAlbum(newAlbum.resource));
      return { type: "SUCCESS", data: newAlbum };
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    // handle errors
  }
};

// Thunk to Update an Album
export const thunkUpdateAlbum = (albumId, updatedData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/albums/${albumId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedAlbum = await response.json();
      dispatch(actionUpdateAlbum(updatedAlbum));
      return { type: "SUCCESS", data: updatedAlbum };
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    // handle errors
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

    // case GET_ALBUM_IMAGES:
    //   newState = { ...state, singleAlbum: { byId: {}, allIds: [] } };
    //   newState.singleAlbum = {
    //     byId: { ...action.album.byId },
    //     allIds: [...action.album.allIds],
    //   };
    //   return newState;
    case GET_ALBUM_IMAGES:
      newState = {
        ...state,
        singleAlbum: {
          byId: { ...action.images.byId },
          allIds: [...action.images.allIds],
        },
        albumInfo: { ...action.albumInfo },
      };
      console.log("New state after GET_ALBUM_IMAGES:", newState);
      return newState;

    case GET_ALBUMS_BY_USER_ID:
      return {
        ...state,
        userAlbums: action.albums,
      };
      
    case CREATE_ALBUM:
      newState = { ...state };
      newState.allAlbums.byId[action.album.id] = action.album;
      newState.allAlbums.allIds.push(action.album.id);
      return newState;

    case UPDATE_ALBUM:
      newState = { ...state };
      newState.allAlbums.byId[action.album.id] = action.album;
      return newState;

    case GET_USER_INFO:
      newState = { ...state, userInfo: {} };
      newState.userInfo = { ...action.userInfo };
      return newState;

    default:
      return state;
  }
}
