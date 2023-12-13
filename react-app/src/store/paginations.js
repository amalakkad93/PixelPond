import { normalizeArray } from "../assets/helpers/storesHelpers";
import { setLoading, setError } from "./ui";

// Action types
const SET_CURRENT_PAGE = "pagination/SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "pagination/SET_TOTAL_PAGES";

// Action creators
export const actionSetCurrentPage = (currentPage) => ({
  type: SET_CURRENT_PAGE,
  currentPage,
});

export const actionSetTotalPages = (totalPages) => ({
  type: SET_TOTAL_PAGES,
  totalPages,
});

export const fetchPaginatedData = (
  url,
  actionCreators = [],
  page = 1,
  perPage = 10,
  additionalParams = {},
  customHeaders = {},
  customErrorHandling = null,
  normalizeFlags = [],
  dataName,
  usePaginationActions = true
) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const currentPage = getState().paginations.currentPage;
  try {
    // const queryParams = new URLSearchParams({ page: currentPage, per_page: perPage, ...additionalParams });
    const queryParams = new URLSearchParams({ page, per_page: perPage, ...additionalParams });
    const response = await fetch(`${url}?${queryParams.toString()}`, {
      headers: { 'Content-Type': 'application/json', ...customHeaders },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ file: paginations.js, Data fetched:", data);

      // Dispatch each action creator with the appropriate data
      actionCreators.forEach((actionCreator, index) => {
        console.log(`🚀 ~ file: paginations.js, Dispatching action: ${actionCreator.name}, with data:`, data[dataName]);
        if (typeof actionCreator === 'function') {
          const normalizeFlag = normalizeFlags[index] !== undefined ? normalizeFlags[index] : true;
          if (normalizeFlag) {
            dispatch(actionCreator(normalizeArray(data[dataName])));
          } else {
            dispatch(actionCreator(data)); // Dispatch without normalizeArray
          }
        }
      });

      if (usePaginationActions) {
        // Dispatch pagination actions only if flag is true
        dispatch(actionSetTotalPages(data.total_pages));
        dispatch(actionSetCurrentPage(page));
      }
    } else {
      const errors = await response.json();
      if (customErrorHandling) {
        customErrorHandling(errors);
      } else {
        dispatch(setError(errors.error || "Error fetching data."));
      }
    }
  } catch (error) {
    if (customErrorHandling) {
      customErrorHandling(error);
    } else {
      dispatch(setError("An error occurred while fetching data."));
    }
  } finally {
    dispatch(setLoading(false));
  }
};



// Reducer
const initialState = {
  currentPage: 1,
  totalPages: 1,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.currentPage };
    case SET_TOTAL_PAGES:
      return { ...state, totalPages: action.totalPages };
    default:
      return state;
  }
}
