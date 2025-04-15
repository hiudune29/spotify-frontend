import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./slice/songSlice.js";
import userReducer from "./slice/userSlice.js";

import albumReducer from "./slice/albumSlice.js";
import artistReducer from "./slice/artistSlice.js";
export const store = configureStore({
  reducer: {
    song: songReducer,
    user: userReducer,
    album: albumReducer,
    artist: artistReducer,
  },
});
