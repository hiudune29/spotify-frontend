import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");

export const createPlaylist = createAsyncThunk(
  "playlists/create",
  async (playlistData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/playlists/create",
        playlistData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlists/update",
  async ({ id, playlistData, avatarFile }, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append(
        "playlist",
        new Blob([JSON.stringify(playlistData)], {
          type: "application/json",
        })
      );

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await axios.put(
        `http://localhost:8080/api/playlists/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlists/delete",
  async (id, thunkAPI) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/playlists/disable/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPlaylistsByUserId = createAsyncThunk(
  "playlists/fetchByUserId",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/playlists/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSongs = createAsyncThunk(
  "playlists/fetchSongs",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/songs/page?pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result.content || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPlaylistSongs = createAsyncThunk(
  "playlist/fetchPlaylistSongs",
  async (playlistId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/playlists/song/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRandomSong = createAsyncThunk(
  "playlists/fetchRandomSong",
  async (excludeSongId, { rejectWithValue }) => {
    try {
      // Log để debug
      console.log("Calling random API with excludeSongId:", excludeSongId);

      // Xây dựng URL với điều kiện
      const url = excludeSongId
        ? `http://localhost:8080/api/songs/random?exclude=${excludeSongId}`
        : `http://localhost:8080/api/songs/random`;

      console.log("API URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log response để debug
      console.log("API Response:", response.data);

      if (!response.data.result) {
        throw new Error("No song received from API");
      }

      return response.data.result;
    } catch (error) {
      console.error("Error in fetchRandomSong:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  items: [],
  songs: [],
  isRandom: false,
  currentSong: null,
  currentPlaylist: null,
  currentSongIndex: 0,
  currentPlayingSongId: null,
  selectedSong: null,
  queue: [],
  showPlaylistContent: false,
  loading: false,
  error: null,
  repeatMode: 0,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setSelectedSong: (state, action) => {
      state.selectedSong = action.payload;
    },
    clearSelectedSong: (state) => {
      state.selectedSong = null;
    },
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.currentPlayingSongId = action.payload.songId;
      state.isPlaying = true;
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
      if (action.payload.songs?.length > 0) {
        state.queue = action.payload.songs;
        state.currentSong = action.payload.songs[0];
        state.currentSongIndex = 0;
        state.currentPlayingSongId = action.payload.songs[0].songId;
      }
    },
    togglePlaylistContent: (state, action) => {
      state.showPlaylistContent = action.payload;
      if (action.payload) {
        state.selectedSong = null;
      }
    },
    playNextSong: (state) => {
      if (!state.queue.length) return;
      let nextIndex;
      if (state.isRandom) {
        do {
          nextIndex = Math.floor(Math.random() * state.queue.length);
        } while (
          nextIndex === state.currentSongIndex &&
          state.queue.length > 1
        );
      } else {
        nextIndex = (state.currentSongIndex + 1) % state.queue.length;
      }
      const nextSong = state.queue[nextIndex];
      state.currentSongIndex = nextIndex;
      state.currentSong = nextSong;
      state.currentPlayingSongId = nextSong.songId;
      state.isPlaying = true;
    },
    playPreviousSong: (state) => {
      if (!state.queue.length) return;
      let prevIndex;
      if (state.isRandom) {
        do {
          prevIndex = Math.floor(Math.random() * state.queue.length);
        } while (
          prevIndex === state.currentSongIndex &&
          state.queue.length > 1
        );
      } else {
        prevIndex =
          state.currentSongIndex - 1 < 0
            ? state.queue.length - 1
            : state.currentSongIndex - 1;
      }
      const prevSong = state.queue[prevIndex];
      state.currentSongIndex = prevIndex;
      state.currentSong = prevSong;
      state.currentPlayingSongId = prevSong.songId;
      state.isPlaying = true;
    },
    setCurrentSongIndex: (state, action) => {
      state.currentSongIndex = action.payload;
      const song = state.currentPlaylist.songs[action.payload];
      if (song) {
        state.currentSong = song;
        state.currentPlayingSongId = song.songId;
      }
    },
    toggleRandom: (state) => {
      state.isRandom = !state.isRandom;
    },
    togglePlay: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetPlaylistState: (state) => {
      state.currentPlaylist = null;
      state.selectedSong = null;
      state.showPlaylistContent = false;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      if (!state.currentSong && action.payload.length > 0) {
        state.currentSong = action.payload[0];
        state.currentSongIndex = 0;
        state.currentPlayingSongId = action.payload[0].songId;
      }
    },
    clearQueue: (state) => {
      state.queue = [];
      state.currentSong = null;
      state.currentSongIndex = 0;
      state.currentPlayingSongId = null;
      state.isPlaying = false;
    },
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistsByUserId.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlaylistsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.songs = action.payload;
        state.loading = false;
      })
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlaylistSongs.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
        if (action.payload.songs?.length > 0) {
          state.queue = action.payload.songs;
          if (!state.currentSong) {
            state.currentSong = action.payload.songs[0];
            state.currentSongIndex = 0;
            state.currentPlayingSongId = action.payload.songs[0].songId;
          }
        }
        state.loading = false;
      })
      .addCase(fetchPlaylistSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRandomSong.fulfilled, (state, action) => {
        state.queue.push(action.payload);
        if (!state.currentSong) {
          state.currentSong = action.payload;
          state.currentSongIndex = state.queue.length - 1;
          state.currentPlayingSongId = action.payload.songId;
        }
      });
  },
});

export const {
  setSelectedSong,
  clearSelectedSong,
  setCurrentSong,
  setCurrentPlaylist,
  togglePlaylistContent,
  playNextSong,
  playPreviousSong,
  setCurrentSongIndex,
  togglePlay,
  resetPlaylistState,
  setQueue,
  clearQueue,
  toggleRandom,
  setRepeatMode,
} = playlistSlice.actions;

export default playlistSlice.reducer;
