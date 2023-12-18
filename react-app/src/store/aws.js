// Action Types
const SET_UPLOAD_URL = "aws/SET_UPLOAD_URL";
const SET_IMAGE_URL = "aws/SET_IMAGE_URL";
const CLEAR_AWS_STATE = "aws/CLEAR_AWS_STATE";
const SET_UPLOADED_IMAGE_URL = "aws/SET_UPLOADED_IMAGE_URL";
const SET_ERROR = "aws/SET_ERROR";

// Action Creators
const setUploadUrl = (url) => ({
  type: SET_UPLOAD_URL,
  payload: url,
});

const setImageUrl = (url) => ({
  type: SET_IMAGE_URL,
  payload: url,
});

const clearAwsState = () => ({
  type: CLEAR_AWS_STATE,
});

// action creator for setting the uploaded image URL
export const setUploadedImageUrl = (url) => ({
  type: SET_UPLOADED_IMAGE_URL,
  payload: url,
});

const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Thunks
// export const getPresignedUrl = (filename, contentType) => async (dispatch) => {
//   try {
//     const response = await fetch(
//       `/api/s3/generate_presigned_url?filename=${filename}&contentType=${contentType}`
//     );
//     if (response.ok) {
//       const { presigned_url, file_url } = await response.json();
//       dispatch(setUploadUrl(presigned_url));
//       dispatch(setImageUrl(file_url));
//     } else {
//       const { error } = await response.json();
//       dispatch(setError(error));
//     }
//   } catch (error) {
//     dispatch(setError("Failed to generate presigned URL"));
//   }
// };

export const deleteImage = (imageUrl) => async (dispatch) => {
  console.log("Type of imageUrl:", typeof imageUrl); 

  try {
      const response = await fetch("/api/s3/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: imageUrl }),
      });
    if (!response.ok) {
      const { error } = await response.json();
      dispatch(setError(error));
    }
  } catch (error) {
    dispatch(setError("Failed to delete image"));
  }
};

// export const getPresignedUrl =
//   (filename, contentType, file) => async (dispatch) => {
//     try {
//       const presignedResponse = await fetch(
//         `/api/s3/generate_presigned_url?filename=${encodeURIComponent(
//           filename
//         )}&contentType=${contentType}`
//       );
//       if (!presignedResponse.ok) throw new Error("Failed to get presigned URL");

//       const { presigned_url, file_url } = await presignedResponse.json();

//       // Perform the upload to S3
//       const uploadResult = await fetch(presigned_url, {
//         method: "PUT",
//         headers: { "Content-Type": contentType },
//         body: file,
//       });

//       if (uploadResult.status !== 200)
//         throw new Error("Failed to upload image");

//       // Dispatch success action with file_url
//       dispatch(setUploadedImageUrl(file_url));
//     } catch (error) {
//       dispatch(setError(error.message));
//       return null;
//     }
//   };

export const getPresignedUrl = (filename, contentType) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/s3/generate_presigned_url?filename=${encodeURIComponent(filename)}&contentType=${contentType}`
    );
    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }
    const { presigned_url, file_url } = await response.json();
    return { presignedUrl: presigned_url, fileUrl: file_url };
  } catch (error) {
    dispatch(setError(error.message));
    return null; // Important to return null or an error object here
  }
};

// AWS Reducer
const initialState = {
  uploadUrl: "",
  imageUrl: "",
  uploadedImageUrl: "",
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_UPLOAD_URL:
      return { ...state, uploadUrl: action.payload };

    case SET_IMAGE_URL:
      return { ...state, imageUrl: action.payload };

    case CLEAR_AWS_STATE:
      return initialState;

    case SET_UPLOADED_IMAGE_URL:
      console.log("Setting uploaded image URL to:", action.payload);
      return { ...state, uploadedImageUrl: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}