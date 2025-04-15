import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import userReducer from "./slice/userSlice.js";

export const store = configureStore({
  reducer: {
    song: songReducer,
    user: userReducer,
  },
});
