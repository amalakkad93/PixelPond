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
// export const actionGetAlbumImages = (data) => {
//   const { images, album_info } = data;
//   console.log("-----Data in actionGetAlbumImages:", data);
//   console.log("-----Images in actionGetAlbumImages:", images);
//   console.log("-----Album Info in actionGetAlbumImages:", album_info);
//   return {
//     type: GET_ALBUM_IMAGES,
//     images: images.byId ? images : normalizeArray(images),
//     albumInfo: album_info,
//   };
// };
// export const actionGetAlbumImages = (albumImages) => {

//   console.log("-----Data in actionGetAlbumImages:", albumImages);

//   return {
//     type: GET_ALBUM_IMAGES,
//     albumImages: normalizeArray(albumImages, "id"),
//     user_id:  albumImages.user_id,
//   };
// };
export const actionGetAlbumImages = (albumId, imagesData, userId) => {
  console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 ~ file: albums.js:42 ~ actionGetAlbumImages ~  userId:",  userId)
  console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 ~ file: albums.js:42 ~ actionGetAlbumImages ~ imagesData:", imagesData)
  console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀 ~ file: albums.js:42 ~ actionGetAlbumImages ~ albumId:", albumId)
  const normalizedImages = normalizeArray(imagesData, "id");
  return {
    type: GET_ALBUM_IMAGES,
    payload: { albumId, images: normalizedImages, userId },
  };
};




// export const actionGetAlbumImages = (albumImages) => {

//   console.log("-----Data in actionGetAlbumImages:", albumImages);

//   return {
//     type: GET_ALBUM_IMAGES,
//     albumImages: normalizeArray(albumImages, "id"),
//     user_id:  albumImages.user_id,
//   };
// };

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


// // Action creator for albums by user id
// export const actionGetAlbumsByUserId = (albums) => {
//   const normalizedAlbums = albums.map((album) => {
//     const normalizedImages = normalizeArray(album.images, "id");
//     return {
//       ...album.album_info,
//       images: normalizedImages,
//     };
//   });

//   return {
//     type: GET_ALBUMS_BY_USER_ID,
//     albums: normalizeArray(normalizedAlbums, "id"),
//   };
// };

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
    [(data) => {
      // Extracting images and userId from the API response
      const { images, user_id } = data;
      console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀  ~ file: albums.js:118 ~ ThunkGetAlbumImages ~ data:", data)
      console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀  ~ file: albums.js:118 ~ ThunkGetAlbumImages ~ albumId:", albumId)
      console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀  ~ file: albums.js:123 ~ ThunkGetAlbumImages ~ user_id:", user_id)
      console.log("🚀🚀 🚀 🚀 🚀 🚀 🚀 🚀 🚀  ~ file: albums.js:123 ~ ThunkGetAlbumImages ~ images:", images)
      return actionGetAlbumImages(albumId, images, user_id);
    }],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    ["images", "user_id"]
  );
};




// // Thunk to fetch album images with pagination
// export const ThunkGetAlbumImages = (albumId, page, perPage) => {
//   return fetchPaginatedData(
//     `/api/albums/${albumId}`,
//     [(data) =>

//       actionGetAlbumImages(data)
//     ],
//     page,
//     perPage,
//     {},
//     {},
//     null,
//     [false],
//     // [true],
//     "images"
//   );
// };

export const thunkGetAlbumsByUserId = (userId, page, perPage) => {
  return fetchPaginatedData(
    `/api/albums/user/${userId}`,
    [(data) => {
      console.log("-----Fetching albums for data:", data);
      return actionGetAlbumsByUserId(data.albums);
    }],
    page,
    perPage,
    {},
    {},
    null,
    [false],
    ["albums"]
  );
};


// Thunk to Create an Album
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
      // Check if newAlbum contains an id before dispatching
      if (newAlbum && newAlbum.resource && newAlbum.resource.id) {
        dispatch(actionCreateAlbum(newAlbum.resource));
        return { type: "SUCCESS", data: newAlbum };
      } else {
        console.error("Invalid album data received:", newAlbum);
        // Handle error appropriately
      }
    } else {
      const errors = await response.json();
      throw errors;
    }
  } catch (error) {
    console.error("Exception in thunkCreateAlbum:", error); // Log the exception
    return { type: "EXCEPTION", data: error };
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
    // case GET_ALBUM_IMAGES:
    //   newState = {
    //     ...state,
    //     singleAlbum: {
    //       byId: { ...action.albumImages.byId },
    //       allIds: [...action.albumImages.allIds],
    //     },
    //     // albumInfo: { ...action.albumInfo },
    //   };
    //   console.log("New state after GET_ALBUM_IMAGES:", newState);
    //   return newState;
    case GET_ALBUM_IMAGES:
      const { albumId, images, userId } = action.payload;
      console.log("🚀 ~ file: albums.js:272 ~ reducer ~ userId:", userId)
      console.log("🚀 ~ file: albums.js:272 ~ reducer ~ images:", images)
      console.log("🚀 ~ file: albums.js:272 ~ reducer ~ albumId:", albumId)
      return {
        ...state,
        singleAlbum: {
          ...state.singleAlbum,
          byId: {
            ...state.singleAlbum.byId,
            [albumId]: {
              images: images.byId,
              imageIds: images.allIds,
              userId: userId
            }
          },
          allIds: state.singleAlbum.allIds.includes(albumId)
                  ? state.singleAlbum.allIds
                  : [...state.singleAlbum.allIds, albumId]
        }
      };

    case GET_ALBUMS_BY_USER_ID:
      console.log("-----Updating state with new albums:", action.albums);

      return {
        ...state,
        userAlbums: action.albums,
      };
    // newState = { ...state, userAlbums: { byId: {}, allIds: [] } };
    // newState.userAlbums = {
    //   byId: { ...newState.userAlbums.byId, ...action.albums.byId },
    //   allIds: [
    //     ...new Set([...newState.userAlbums.allIds, ...action.albums.allIds]),
    //   ],
    // };
    // return newState;
    // case CREATE_ALBUM:
    //   newState = { ...state };
    //   newState.allAlbums.byId[action.album.id] = action.album;
    //   newState.allAlbums.allIds.push(action.album.id);
    //   return newState;
    case CREATE_ALBUM:
      newState = { ...state };

      if (action.album && action.album.id) {
        newState.allAlbums.byId[action.album.id] = action.album;
        newState.allAlbums.allIds.push(action.album.id);
      } else {
        console.error("Album data is missing or invalid:", action.album);
      }
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
