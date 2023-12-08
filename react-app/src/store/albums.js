import { normalizeArray } from "../assets/helpers/storesHelpers";
import { fetchPaginatedData } from "./paginations";
import { setLoading, setError } from "./ui";

// Action Types
export const GET_ALBUMS = "albums/GET_ALBUMS";
export const GET_ALBUM_IMAGES = "albums/GET_ALBUM_IMAGES";
export const GET_USER_INFO = "albums/GET_USER_INFO";

// Action Creators
export const actionGetAlbums = (albums) => ({
  type: GET_ALBUMS,
  albums,
});

// Action creator for album images
export const actionGetAlbumImages = (album, userInfo) => ({
  type: GET_ALBUM_IMAGES,
  album,
  userInfo,
});

// Action Creator for user info
export const actionGetUserInfo = (userInfo) => ({
  type: GET_USER_INFO,
  userInfo,
});

// Thunk to fetch album images with pagination
export const ThunkGetAlbumImages = (albumId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/${albumId}/images`,
    [actionGetAlbumImages, actionGetUserInfo],
    page,
    perPage
  );
};

// Initial State
const initialState = {
  allAlbums: { byId: {}, allIds: [] },
  ownerAlbums: { byId: {}, allIds: [] },
  singleAlbum: { byId: {}, allIds: [] },
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
    //   console.log('Received images for album:', action.images);
    //   newState = { ...state, singleAlbum: { ...state.singleAlbum } };
    //   newState.singleAlbum.images = {
    //     byId: { ...action.images.byId },
    //     allIds: [...action.images.allIds],
    //   };
    //   return newState;
    case GET_ALBUM_IMAGES:
      // return {
      //   ...state,
      //   singleAlbum: {
      //     ...state.singleAlbum,
      //     images: action.images,
      //     imageIds: action.imageIds
      //   }
      // };

      newState = { ...state, singleAlbum: { byId: {}, allIds: [] } };
      newState.singleAlbum = {
        byId: { ...action.album.byId },
        allIds: [...action.album.allIds],
      };

      return newState;
    case GET_USER_INFO:
      newState = { ...state, userInfo: {} };
      newState.userInfo = { ...action.userInfo };
      return newState;
    
    default:
      return state;
  }
}