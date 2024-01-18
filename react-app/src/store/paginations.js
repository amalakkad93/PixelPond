import { normalizeArray } from "../assets/helpers/storesHelpers";
import { setLoading, setError } from "./ui";
import { setCurrentPage, setTotalPages } from "./posts";

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
    dispatch
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
      const response = await fetch(requestUrl, {
        headers: { "Content-Type": "application/json", ...customHeaders },
      });

      if (response.ok) {
        const data = await response.json();

        // Collect data specified by dataNames
        const collectedData =
          dataNames.length === 0
            ? data
            : dataNames.reduce((acc, name) => {
                acc[name] = data[name];
                return acc;
              }, {});

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
