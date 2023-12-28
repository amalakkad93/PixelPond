// Action Types
export const SET_ALL_FAVORITES = "favorites/SET_ALL_FAVORITES";
export const ADD_FAVORITE = "favorites/ADD_FAVORITE";
export const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";

// Action Creators
export const actionSetAllFavorites = (favorites) => ({
  type: SET_ALL_FAVORITES,
  payload: favorites,
});

export const actionAddFavorite = (favorite) => ({
  type: ADD_FAVORITE,
  payload: favorite,
});

export const actionRemoveFavorite = (favoriteId) => ({
  type: REMOVE_FAVORITE,
  payload: favoriteId,
});



// Thunks
export const thunkFetchAllFavorites = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/favorites?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    const favorites = await response.json();
    dispatch(actionSetAllFavorites(favorites));
  } catch (error) {
    console.error(error);
  }
};

export const thunkToggleFavorite = (userId, postId) => async (dispatch) => {
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, post_id: postId }),
    });
    const data = await response.json();
    if (data.action === 'added') {
      dispatch(actionAddFavorite(data.favorite));
    } else if (data.action === 'removed') {
      dispatch(actionRemoveFavorite(data.favorite.id));
    }
  } catch (error) {
    console.error(error);
  }
};



const initialState = {
  favoritesById: {},
};

const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_FAVORITES:
      const newFavorites = {};
      action.payload.forEach(favorite => {
        newFavorites[favorite.id] = favorite;
      });
      return { ...state, favoritesById: newFavorites };

    case ADD_FAVORITE:
      return {
        ...state,
        favoritesById: { ...state.favoritesById, [action.payload.id]: action.payload },
      };

    case REMOVE_FAVORITE:
      const updatedFavorites = { ...state.favoritesById };
      delete updatedFavorites[action.payload];
      return { ...state, favoritesById: updatedFavorites };

    default:
      return state;
  }
};

export default favoritesReducer;











// const SET_ALL_FAVORITES = "favorites/SET_ALL_FAVORITES";
// const ADD_FAVORITE = "favorites/ADD_FAVORITE";
// const REMOVE_FAVORITE = "favorites/REMOVE_FAVORITE";
// const SET_FAVORITE_ERROR = "favorites/SET_FAVORITE_ERROR";
// const SET_ALL_FAVORITES_BY_ID = "favorites/SET_ALL_FAVORITES_BY_ID";

// // const actionSetAllFavorites = (favorites) => ({
// //   type: SET_ALL_FAVORITES,
// //   payload: favorites,
// // });

// // const actionAddFavorite = (favorite) => ({
// //   type: ADD_FAVORITE,
// //   payload: favorite,
// // });

// // const actionRemoveFavorite = (favoriteId) => ({
// //   type: REMOVE_FAVORITE,
// //   payload: favoriteId,
// // });

// // Action to set all favorites
// const actionSetAllFavorites = (favorites) => ({
//   type: SET_ALL_FAVORITES,
//   payload: favorites.map((favorite) => favorite.post_id),
// });

// // Action to add a favorite
// const actionAddFavorite = (postId) => ({
//   type: ADD_FAVORITE,
//   payload: postId,
// });

// // Action to remove a favorite
// const actionRemoveFavorite = (postId) => ({
//   type: REMOVE_FAVORITE,
//   payload: postId,
// });

// const actionSetAllFavoritesById = (favoritesById) => ({
//   type: SET_ALL_FAVORITES_BY_ID,
//   payload: favoritesById,
// });

// const actionSetFavoriteError = (error) => ({
//   type: SET_FAVORITE_ERROR,
//   payload: error,
// });

// export const thunkFetchAllFavorites = (userId) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/favorites?user_id=${userId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch favorites');
//     }
//     const favorites = await response.json();

//     // Dispatch actions to update both allFavorites and favoritesById
//     dispatch(actionSetAllFavorites(favorites.map(fav => fav.post_id)));
//     const favoritesById = {};
//     favorites.forEach(fav => {
//       favoritesById[fav.id] = fav;
//     });
//     dispatch(actionSetAllFavoritesById(favoritesById));
//   } catch (error) {
//     dispatch(actionSetFavoriteError(error.message));
//   }
// };


// // export const thunkFetchAllFavorites = (userId) => async (dispatch) => {
// //   try {
// //     const response = await fetch(`/api/favorites?user_id=${userId}`);
// //     if (!response.ok) {
// //       throw new Error("Failed to fetch favorites");
// //     }
// //     const favorites = await response.json();
// //     dispatch(actionSetAllFavorites(favorites));
// //   } catch (error) {
// //     dispatch(actionSetFavoriteError(error.message));
// //   }
// // };

// export const thunkToggleFavorite = (userId, postId) => async (dispatch) => {
//   try {
//     console.log(
//       `*****Toggling favorite status for post ${postId} by user ${userId}`
//     );
//     const response = await fetch("/api/favorites", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ user_id: userId, post_id: postId }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to toggle favorite");
//     }
//     const data = await response.json();
//     console.log(`*****Server response for toggling favorite:`, data);
//     if (data.action === "added") {
//       dispatch(actionAddFavorite(postId));
//     } else if (data.action === "removed") {
//       dispatch(actionRemoveFavorite(postId));
//     }
//   } catch (error) {
//     dispatch(actionSetFavoriteError(error.message));
//   }
// };
// // export const thunkToggleFavorite = (userId, postId) => async (dispatch) => {
// //   try {
// //     console.log(
// //       `*****Toggling favorite status for post ${postId} by user ${userId}`
// //     );
// //     const response = await fetch("/api/favorites", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ user_id: userId, post_id: postId }),
// //     });

// //     if (!response.ok) {
// //       throw new Error("Failed to toggle favorite");
// //     }
// //     const data = await response.json();
// //     console.log(`*****Server response for toggling favorite:`, data);
// //     if (data.action === "added") {
// //       dispatch(actionAddFavorite(data.favorite));
// //     } else if (data.action === "removed") {
// //       dispatch(actionRemoveFavorite(data.favorite.id));
// //     }
// //   } catch (error) {
// //     dispatch(actionSetFavoriteError(error.message));
// //   }
// // };

// const initialState = {
//   favoritesById: {},
//   allFavorites: [],
//   error: null,
// };

// export default function favoritesReducer(state = initialState, action) {
//   switch (action.type) {
//     // case SET_ALL_FAVORITES:
//     //   const favoritesById = {};
//     //   action.payload.forEach(fav => {
//     //     favoritesById[fav.id] = fav;
//     //   });
//     //   return {
//     //     ...state,
//     //     favoritesById,
//     //     allFavorites: action.payload.map(fav => fav.id),
//     //   };

//     // case ADD_FAVORITE:
//     //   console.log(`*****Adding favorite:`, action.payload);
//     //   return {
//     //     ...state,
//     //     favoritesById: { ...state.favoritesById, [action.payload.id]: action.payload },
//     //     allFavorites: [...state.allFavorites, action.payload.id],
//     //   };

//     // case REMOVE_FAVORITE:
//     //   console.log(`*****Removing favorite:`, action.payload);
//     //   const newFavoritesById = { ...state.favoritesById };
//     //   delete newFavoritesById[action.payload];
//     //   return {
//     //     ...state,
//     //     favoritesById: newFavoritesById,
//     //     allFavorites: state.allFavorites.filter(id => id !== action.payload),
//     //   };
//     case SET_ALL_FAVORITES:
//       return { ...state, allFavorites: action.payload };
//     case ADD_FAVORITE:
//       return {
//         ...state,
//         allFavorites: [...state.allFavorites, action.payload],
//       };

//     case REMOVE_FAVORITE:
//       return {
//         ...state,
//         allFavorites: state.allFavorites.filter((id) => id !== action.payload),
//       };
//     case SET_ALL_FAVORITES_BY_ID:
//       return { ...state, favoritesById: action.payload };
//     case SET_FAVORITE_ERROR:
//       return { ...state, error: action.payload };

//     default:
//       return state;
//   }
// }
