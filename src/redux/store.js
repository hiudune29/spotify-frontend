import { configureStore } from "@reduxjs/toolkit";
import songAdminReducer from "./slice/songAdminSlice.js";
import userReducer from "./slice/userSlice.js";

import albumReducer from "./slice/albumSlice.js";
import artistReducer from "./slice/artistSlice.js";
import playlistReducer from "./slice/playlistSlice";
import playlistAdminSlide from "./slice/playlistAdminSlide.js";
import userAdminReducer from "./slice/userAdminSlice.js";
export const store = configureStore({
  reducer: {
    songAdmin: songAdminReducer,
    user: userReducer,
    album: albumReducer,
    artist: artistReducer,
    playlists: playlistReducer,
    playlistAdmin: playlistAdminSlide,
    userAdmin: userAdminReducer,
  },
});
