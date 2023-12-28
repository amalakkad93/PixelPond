// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_USER_INFO_BY_ID = "session/GET_USER_INFO_BY_ID";
const SET_USER_INFO = "session/SET_USER_INFO";
const UPDATE_USER_PROFILE = "session/UPDATE_USER_PROFILE";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const setUserInfoById = (userInfo) => ({
  type: GET_USER_INFO_BY_ID,
  payload: userInfo,
});

const actionUpdateUserProfile = (updatedUser) => ({
  type: SET_USER,
  payload: updatedUser,
});

export const authenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }

    dispatch(setUser(data));
  }
};

export const login = (usernameOrEmail, password) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username_or_email: usernameOrEmail,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp =
  (first_name, last_name, age, username, email, password) =>
  async (dispatch) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        age,
        username,
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      return null;
    } else if (response.status < 500) {
      const data = await response.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return ["An error occurred. Please try again."];
    }
  };

// export const fetchUserInfoById = (userId) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/users/${userId}/info`);
//     if (response.ok) {
//       const userInfo = await response.json();
//       dispatch(setUserInfoById(userInfo));
//     } else {
//       // Handle error response
//     }
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     // Handle network error
//   }
// };
export const fetchUserInfoById = (userId) => async (dispatch, getState) => {
  const existingUserInfo = getState().session.byId[userId];
  if (existingUserInfo) return;

  try {
    const response = await fetch(`/api/users/${userId}/info`);
    if (response.ok) {
      const userInfo = await response.json();
      dispatch({ type: "SET_USER_INFO", payload: userInfo });
    } else {
      // Handle error response
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Handle network error
  }
};

// Thunk action to update user profile picture
// Thunk action to update user profile picture
export const updateUserProfilePic = (newProfilePicUrl) => async (dispatch) => {
  try {
    const response = await fetch("/api/users/update-profile-pic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile_picture: newProfilePicUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile picture.");
    }

    const updatedUser = await response.json();
    dispatch(setUser(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

// Update user profile action
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    const response = await fetch("/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      dispatch(actionUpdateUserProfile(updatedUser));
    } else {
      // handle errors
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    // Handle error
  }
};

const initialState = {
  user: null,
  usersById: {},
  byId: {},
  userInfoForDisplay: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };

    // case GET_USER_INFO_BY_ID:
    //   return {
    //     ...state,
    //     usersById: {
    //       ...state.usersById,
    //       [action.payload.id]: action.payload,
    //     },
    //   };
    case GET_USER_INFO_BY_ID:
      return {
        ...state,
        usersById: {
          ...state.usersById,
          [action.payload.id]: action.payload,
        },
        userInfoForDisplay: action.payload,
      };
    case SET_USER_INFO:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id]: action.payload },
      };

    case UPDATE_USER_PROFILE:
      return { user: action.payload };

    case REMOVE_USER:
      return { user: null };

    default:
      return state;
  }
}
