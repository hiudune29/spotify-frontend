import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");
// Create
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

// Update
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

// Delete
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

// Fetch playlists by userId
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

// Fetch all songs
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

// Fetch songs of a playlist
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
const initialState = {
  // Các state đang được sử dụng:
  items: [], // các playlist được load lên
  songs: [], // Dùng cho danh sách playlist trong sidebar
  isRandom: false, // Random bài hát
  currentSong: null, // Bài hát đang phát
  currentPlaylist: null, // Playlist đang được hiển thị/phát
  currentSongIndex: 0, // Vị trí bài hát trong playlist
  currentPlayingSongId: null, // ID của bài hát đang phát
  selectedSong: null, // Bài hát được chọn để xem chi tiết
  queue: [], // Hàng đợi
  showPlaylistContent: false, // Toggle hiển thị playlist
  loading: false, // Trạng thái loading
  error: null, // Thông tin lỗi
  repeatMode: 0, // 0: tắt, 1: lặp bài hiện tại, 2: lặp queue
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
      // Nếu có songs trong playlist mới
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
        // When showing playlist content, clear selected song
        state.selectedSong = null;
      }
    },
    playNextSong: (state) => {
      if (!state.queue.length) return;

      let nextIndex;
      if (state.isRandom) {
        // Tránh lặp lại bài hát đang phát nếu queue có nhiều hơn 1 bài
        do {
          nextIndex = Math.floor(Math.random() * state.queue.length);
        } while (
          nextIndex === state.currentSongIndex &&
          state.queue.length > 1
        );
      } else {
        // Nếu không random thì phát tuần tự
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
        // Tránh lặp lại bài hát đang phát nếu queue có nhiều hơn 1 bài
        do {
          prevIndex = Math.floor(Math.random() * state.queue.length);
        } while (
          prevIndex === state.currentSongIndex &&
          state.queue.length > 1
        );
      } else {
        // Nếu không random thì phát lùi
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
      console.log("Setting new queue:", action.payload);
      state.queue = action.payload;

      if (!state.currentSong && action.payload.length > 0) {
        state.currentSong = action.payload[0];
        state.currentSongIndex = 0;
        state.currentPlayingSongId = action.payload[0].songId;
        console.log("Set current song:", state.currentSong);
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
      .addCase(fetchPlaylistsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistsByUserId.fulfilled, (state, action) => {
        // console.log("🎯 Playlists from API:", action.payload);
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchPlaylistsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.songs = action.payload;
        state.loading = false;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPlaylistSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistSongs.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
        // Thêm songs vào queue khi load playlist
        if (action.payload.songs && action.payload.songs.length > 0) {
          state.queue = action.payload.songs;

          // Chỉ set bài hát mới nếu chưa có bài nào đang phát
          if (!state.currentSong) {
            state.currentSong = action.payload.songs[0];
            state.currentSongIndex = 0;
            state.currentPlayingSongId = action.payload.songs[0].songId;
          }
        }
        state.loading = false;

        // Log để debug
        console.log("Queue sau khi load playlist:", state.queue);
        console.log("Current song:", state.currentSong);
      })
      .addCase(fetchPlaylistSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
        state.loading = false;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        // Remove the deleted playlist from items array
        state.items = state.items.filter(
          (playlist) => playlist.playlistId !== action.payload
        );
        // Reset current playlist if it was the one deleted
        if (state.currentPlaylist?.playlist?.playlistId === action.payload) {
          state.currentPlaylist = null;
          state.showPlaylistContent = false;
        }
        state.loading = false;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((pl) =>
          pl.playlistId === updated.playlistId ? updated : pl
        );
        if (
          state.currentPlaylist?.playlist?.playlistId === updated.playlistId
        ) {
          state.currentPlaylist.playlist = updated;
        }
        state.loading = false;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
