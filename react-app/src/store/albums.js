import { normalizeArray } from "../assets/helpers/storesHelpers";
import { fetchPaginatedData } from "./paginations";
import { setLoading, setError } from "./ui";

// Action Types
export const GET_ALBUMS = "albums/GET_ALBUMS";
export const GET_ALBUM_IMAGES = "albums/GET_ALBUM_IMAGES";
export const GET_USER_INFO = "albums/GET_USER_INFO";
export const GET_ALBUMS_BY_USER_ID = "albums/GET_ALBUMS_BY_USER_ID";

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

// export const actionGetAlbumsByUserId = (albums) => ({
//   type: GET_ALBUMS_BY_USER_ID,
//   albums,
// });

// Action Creator for user info
export const actionGetUserInfo = (userInfo) => ({
  type: GET_USER_INFO,
  userInfo,
});

// // Thunk to fetch album images with pagination
// export const ThunkGetAlbumImages = (albumId, page, perPage) => {
//   return fetchPaginatedData(
//     `/api/albums/${albumId}`,
//     [actionGetAlbumImages],
//     page,
//     perPage,
//     {},
//     {},
//     null,
//     [true],
//     "images"
//     // [false],
//   );
// };

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
    // case GET_ALBUMS_BY_USER_ID:
    //   newState = { ...state, userAlbums: { byId: {}, allIds: [] } };
    //   newState.userAlbums = {
    //     byId: { ...action.albums.byId },
    //     allIds: [...action.albums.allIds],
    //   };
    //   return newState;

    case GET_USER_INFO:
      newState = { ...state, userInfo: {} };
      newState.userInfo = { ...action.userInfo };
      return newState;

    default:
      return state;
  }
}
