import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import playlistReducer from "./slice/playlistSlice";

export const store = configureStore({
  reducer: {
    song: songReducer,
    playlists: playlistReducer,
  },
});
