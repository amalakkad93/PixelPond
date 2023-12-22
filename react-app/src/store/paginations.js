import { normalizeArray } from "../assets/helpers/storesHelpers";
import { setLoading, setError } from "./ui";
import { setCurrentPage, setTotalPages } from "./posts";

// // Action types
// const SET_CURRENT_PAGE = "pagination/SET_CURRENT_PAGE";
// const SET_TOTAL_PAGES = "pagination/SET_TOTAL_PAGES";

// // Action creators
// export const actionSetCurrentPage = (currentPage) => ({
//   type: SET_CURRENT_PAGE,
//   currentPage,
// });

// export const actionSetTotalPages = (totalPages) => ({
//   type: SET_TOTAL_PAGES,
//   totalPages,
// });

// export const fetchPaginatedData = (
//   url,
//   actionCreators = [],
//   page = 1,
//   perPage = 10,
//   additionalParams = {},
//   customHeaders = {},
//   customErrorHandling = null,
//   normalizeFlags = [],
//   dataName,
//   usePaginationActions = true
// ) => async (dispatch, getState) => {
//   dispatch(setLoading(true));
//   const currentPage = getState().paginations.currentPage;
//   try {
//     // const queryParams = new URLSearchParams({ page: currentPage, per_page: perPage, ...additionalParams });
//     const queryParams = new URLSearchParams({ page, per_page: perPage, ...additionalParams });
//     const response = await fetch(`${url}?${queryParams.toString()}`, {
//       headers: { 'Content-Type': 'application/json', ...customHeaders },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("🚀 ~ file: paginations.js, Data fetched:", data);

//       // Dispatch each action creator with the appropriate data
//       actionCreators.forEach((actionCreator, index) => {
//         console.log(`🚀 ~ file: paginations.js, Dispatching action: ${actionCreator.name}, with data:`, data[dataName]);
//         if (typeof actionCreator === 'function') {
//           const normalizeFlag = normalizeFlags[index] !== undefined ? normalizeFlags[index] : true;
//           if (normalizeFlag) {
//             dispatch(actionCreator(normalizeArray(data[dataName])));
//           } else {
//             dispatch(actionCreator(data)); // Dispatch without normalizeArray
//           }
//         }
//       });
//       dispatch(setTotalPagesPost(data.total_pages));
//       dispatch(setCurrentPagePost(page));

//       // if (usePaginationActions) {
//       //   // Dispatch pagination actions only if flag is true
//       //   dispatch(setTotalPagesPost(data.total_pages));
//       //   dispatch(setCurrentPagePost(page));
//       // }
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

export const fetchPaginatedData =
  (
    url,
    actionCreators = [],
    page = 1,
    perPage = 10,
    additionalParams = {},
    customHeaders = {},
    customErrorHandling = null,
    normalizeFlags = [],
    dataNames = [],
    section,
  ) =>
  async (dispatch) => {


    dispatch(setLoading(true));

    try {
      const queryParams = new URLSearchParams({
        page,
        per_page: perPage,
        ...additionalParams,
      });
      const requestUrl = `${url}?${queryParams.toString()}`;
      console.log("Request URL:", requestUrl);

      const response = await fetch(requestUrl, {
        headers: { "Content-Type": "application/json", ...customHeaders },
      });

      console.log("Network response:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched:", data);

        // Collect data specified by dataNames
        const collectedData =
          dataNames.length === 0
            ? data
            : dataNames.reduce((acc, name) => {
                acc[name] = data[name];
                return acc;
              }, {});

        console.log("Collected data for action creators:", collectedData);

        // Dispatch actions for each action creator
        actionCreators.forEach((actionCreator, index) => {
          let res;
          if (
            normalizeFlags[index] &&
            Array.isArray(collectedData[dataNames[index]])
          ) {
            const normalizedData = normalizeArray(
              collectedData[dataNames[index]],
              "id"
            );
            res = dispatch(actionCreator(normalizedData, data));
          } else {
            res = dispatch(actionCreator(collectedData, data));

          }
        });

        // dispatch(setTotalPages(section, data.total_pages));
        // dispatch(setCurrentPage(section, page));
        return data;
      } else {
        const errors = await response.json();
        console.error("API Error:", errors);
        if (customErrorHandling) {
          customErrorHandling(errors);
        } else {
          dispatch(setError(errors.error || "Error fetching data."));
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (customErrorHandling) {
        customErrorHandling(error);
      } else {
        dispatch(setError("An error occurred while fetching data."));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

// export const fetchPaginatedData =
//   (
//     url,
//     actionCreators = [],
//     page = 1,
//     perPage = 10,
//     additionalParams = {},
//     customHeaders = {},
//     customErrorHandling = null,
//     normalizeFlags = [],
//     dataNames = []
//   ) =>
//   async (dispatch) => {
//     dispatch(setLoading(true));

//     try {
//       const queryParams = new URLSearchParams({
//         page,
//         per_page: perPage,
//         ...additionalParams,
//       });
//       const requestUrl = `${url}?${queryParams.toString()}`;
//       console.log("Request URL:", requestUrl); // Log the request URL

//       const response = await fetch(requestUrl, {
//         headers: { "Content-Type": "application/json", ...customHeaders },
//       });

//       console.log("Network response:", response); // Log the response object

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Data fetched:", data);

//         // actionCreators.forEach((actionCreator, index) => {
//         //   const actionData = data[dataName];
//         //   console.log(`---fetchPaginatedData - actionData for ${dataName}:`, actionData);

//         //   if (normalizeFlags[index] && Array.isArray(actionData)) {
//         //     const normalizedData = normalizeArray(actionData);
//         //     dispatch(actionCreator(normalizedData, data));
//         //   } else {
//         //     dispatch(actionCreator(actionData, data));
//         //   }
//         // });

//         actionCreators.forEach((actionCreator, index) => {
//           const dataName = dataNames[index];
//           const actionData = data[dataName];
//           console.log(`---fetchPaginatedData - actionData for ${dataName}:`, actionData);

//           if (normalizeFlags[index] && Array.isArray(actionData)) {
//             const normalizedData = normalizeArray(actionData, 'id');
//             dispatch(actionCreator(normalizedData, data));
//           } else {
//             dispatch(actionCreator(actionData, data));

//           }
//         });

//         dispatch(setTotalPagesPost(data.total_pages));
//         dispatch(setCurrentPagePost(page));
//       } else {
//         const errors = await response.json();
//         console.error("API Error:", errors);
//         if (customErrorHandling) {
//           customErrorHandling(errors);
//         } else {
//           dispatch(setError(errors.error || "Error fetching data."));
//         }
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       if (customErrorHandling) {
//         customErrorHandling(error);
//       } else {
//         dispatch(setError("An error occurred while fetching data."));
//       }
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

// Reducer
// const initialState = {
//   currentPage: 1,
//   totalPages: 1,
// };

// export default function reducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_CURRENT_PAGE:
//       return { ...state, currentPage: action.currentPage };
//     case SET_TOTAL_PAGES:
//       return { ...state, totalPages: action.totalPages };
//     default:
//       return state;
//   }
// }
