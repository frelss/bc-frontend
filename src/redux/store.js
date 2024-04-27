import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import projectsReducer from "./projectSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
  },
});
