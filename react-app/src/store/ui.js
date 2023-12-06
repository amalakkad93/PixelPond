export const SET_LOADING = 'ui/SET_LOADING';
export const SET_ERROR = 'ui/SET_ERROR';
export const CLEAR_UI_STATE = 'ui/CLEAR_UI_STATE';

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearUIState = () => ({
  type: CLEAR_UI_STATE,
});


const initialState = {
  loading: false,
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_UI_STATE:
      return { ...initialState };
    default:
      return state;
  }
};
