import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import userReducer from "./slice/userSlice.js";
import searchReducer from "./slice/searchSlice";
import albumReducer from "./slice/albumSlice.js";
import artistReducer from "./slice/artistSlice.js";
import playlistReducer from "./slice/playlistSlice";
import uiReducer from "./slice/uiSlice";
export const store = configureStore({
  reducer: {
    song: songReducer,
    user: userReducer,
    album: albumReducer,
    artist: artistReducer,
    playlists: playlistReducer,
    search: searchReducer,
    ui: uiReducer,
  },
});
