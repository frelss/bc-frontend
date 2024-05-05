import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://prmanagement-api.onrender.com/api";

//fetching users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (
    { searchTerm = "", searchField = "name", role = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/getallusers`, {
        params: {
          [searchField]: searchTerm,
          role,
        },
      });
      return { users: response.data.data.users, count: response.data.results };
    } catch (error) {
      return rejectWithValue(
        "Failed to fetch user data. Please try again later."
      );
    }
  }
);

//delete
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}//users/${userId}`);
      if (response.status === 200) {
        return userId;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//updating role
export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}//users/updateUserRole/${userId}`,
        { newRole }
      );
      if (response.status === 200) {
        return { userId, newRole };
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//updating password (app)
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    console.log(currentPassword);
    try {
      const response = await axios.patch(`${BASE_URL}/users/updatePassword`, {
        userId,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Failed to update password.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to update password."
        );
      } else {
        return rejectWithValue("Failed to update password.");
      }
    }
  }
);

//forgotPassword
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/forgotPassword`, {
        email,
      });
      return response.data.message;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An error occurred. Please try again later.");
      }
    }
  }
);

// Email verification
export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users/verifyEmail/${token}`
      );

      if (response.data.status === "success") {
        dispatch(login(response.data.user));
      }

      return response.data.message;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Verification failed. Please try again later.");
      }
    }
  }
);

// Resend verification email
export const resendVerificationEmail = createAsyncThunk(
  "user/resendVerificationEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/users/resendVerificationEmail`,
        { email }
      );
      return response.data.message;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          "Failed to resend verification email. Please try again later."
        );
      }
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/users/resetPassword/${token}`,
        { password, confirmPassword }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Failed to reset password.");
      }
    }
  }
);

//REGISZTRACIO
export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/signup`, {
        name,
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// BEJELENTKEZES
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      return {
        user: response.data.user,
        status: response.data.status,
        token: response.data.token,
        role: response.data.user.role,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      // hbias adat torlese
      localStorage.removeItem("user");
      return null;
    }
  } else {
    return null;
  }
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token") || null;
};

const initialState = {
  userId: null,
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
  userList: [],
  isDarkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.isDarkMode));
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.user._id;
      state.status = action.payload.status;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    [login.rejected]: (state) => {
      state.user = null;
      state.status = "failed";
    },
    [register.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    [register.rejected]: (state, action) => {
      state.registrationError = action.error.message;
    },
    [fetchUsers.pending]: (state) => {
      state.isLoading = true;
      state.fetchError = null;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.userList = action.payload.users;
      state.userCount = action.payload.count;
      state.isLoading = false;
    },
    [fetchUsers.rejected]: (state, action) => {
      console.error("Error fetching user data:", action.error);
      state.isLoading = false;
      state.fetchError = "Failed to fetch user data. Please try again later.";
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.userList = state.userList.filter(
        (user) => user._id !== action.payload
      );
    },
    [deleteUser.rejected]: (state, action) => {
      state.error = action.payload || "Could not delete user";
    },
    [updateUserRole.fulfilled]: (state, action) => {
      console.log("User role updated:", action.payload);

      const { userId, newRole } = action.payload;
      //state-ban megkeresni az usert es updatelni a rolet
      const updatedUserList = state.userList.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      );
      state.userList = updatedUserList;
    },
    [updatePassword.pending]: (state) => {
      state.updatePasswordLoading = true;
      state.updatePasswordError = null;
    },
    [updatePassword.fulfilled]: (state) => {
      state.updatePasswordLoading = false;
      state.updatePasswordSuccess = true;
      state.updatePasswordError = null;
    },
    [updatePassword.rejected]: (state, action) => {
      state.updatePasswordLoading = false;
      state.updatePasswordError =
        action.error.message || "Failed to update password.";
      state.updatePasswordSuccess = false;
    },
    [forgotPassword.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [forgotPassword.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to send password reset email.";
    },
    [resetPassword.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [resetPassword.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [resetPassword.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to reset password.";
    },
    [verifyEmail.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [verifyEmail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.verificationMessage = action.payload;
    },
    [verifyEmail.rejected]: (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload || "Verification failed. Please try again later.";
    },
  },
});

export const { toggleTheme, setUser, setUserId, logout, setUserList } =
  userSlice.actions;

export default userSlice.reducer;
