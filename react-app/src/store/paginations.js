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
  customErrorHandling = null
) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const queryParams = new URLSearchParams({ page, per_page: perPage, ...additionalParams });
    const response = await fetch(`${url}?${queryParams.toString()}`, {
      headers: { 'Content-Type': 'application/json', ...customHeaders },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ file: paginations.js:37 ~ )=> ~ data :", data);

      // Dispatch each action creator with the fetched data
      dispatch(actionCreators[0](normalizeArray(data.items)));
      dispatch(actionCreators[1](data.user_info));
      console.log("🚀 ~ file: paginations.js:41 ~ )=> ~ actionCreators[1](data.userInfo):", actionCreators[1](data.user_info))

      // actionCreators.forEach((actionCreator) => {
      //   dispatch(actionCreator(normalizeArray(data.items)));
      // });

      dispatch(actionSetTotalPages(data.total_pages));
      dispatch(actionSetCurrentPage(page));
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
// export const fetchPaginatedData = (
//   url,
//   actionCreator,
//   page = 1,
//   perPage = 10,
//   additionalParams = {},
//   customHeaders = {},
//   customErrorHandling = null
// ) => async (dispatch) => {
//   dispatch(setLoading(true));
//   try {
//     const queryParams = new URLSearchParams({ page, per_page: perPage, ...additionalParams });
//     const response = await fetch(`${url}?${queryParams.toString()}`, {
//       headers: { 'Content-Type': 'application/json', ...customHeaders },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("🚀 ~ file: paginations.js:37 ~ )=> ~ data :", data )

//       // dispatch(actionCreator(normalizeArray(data.items)));
//       dispatch(actionCreator(normalizeArray(data.items)));
//       // dispatch(actionCreator(data.));
//       // dispatch(actionCreator(data));
//       dispatch(actionSetTotalPages(data.total_pages));
//       dispatch(actionSetCurrentPage(page));
//     } else {
//       const errors = await response.json();
//       if (customErrorHandling) {
//         customErrorHandling(errors);
//       } else {
//         dispatch(setError(errors.error || "Error fetching data."));
//       }
//     }
//   } catch (error) {
//     if (customErrorHandling) {
//       customErrorHandling(error);
//     } else {
//       dispatch(setError("An error occurred while fetching data."));
//     }
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

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
