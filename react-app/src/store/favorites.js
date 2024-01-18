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
    return data;
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
