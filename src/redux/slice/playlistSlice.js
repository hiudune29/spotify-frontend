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
            "Content-Type": "multipart/form-data",
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
        `http://localhost:8080/api/playlists/delete/${id}`,
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
  items: [], // Dùng cho danh sách playlist trong sidebar
  songs: [], // Dùng cho danh sách bài hát
  currentSong: null, // Bài hát đang phát
  currentPlaylist: null, // Playlist đang được hiển thị/phát
  currentSongIndex: 0, // Vị trí bài hát trong playlist
  currentPlayingSongId: null, // ID của bài hát đang phát
  selectedSong: null, // Bài hát được chọn để xem chi tiết
  showPlaylistContent: false, // Toggle hiển thị playlist
  loading: false, // Trạng thái loading
  error: null, // Thông tin lỗi
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
      // Nếu playlist không rỗng, set currentSong là bài đầu tiên
      if (action.payload.length > 0) {
        state.currentSong = action.payload[0];
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
      if (!state.currentPlaylist.songs.length) return;

      const nextIndex = state.isRandom
        ? Math.floor(Math.random() * state.currentPlaylist.songs.length)
        : (state.currentSongIndex + 1) % state.currentPlaylist.songs.length;

      state.currentSongIndex = nextIndex;
      const nextSong = state.currentPlaylist.songs[nextIndex];
      state.currentSong = nextSong;
      state.currentPlayingSongId = nextSong.songId;
      state.isPlaying = true;
    },
    playPreviousSong: (state) => {
      if (!state.currentPlaylist.songs.length) return;

      const prevIndex = state.isRandom
        ? Math.floor(Math.random() * state.currentPlaylist.songs.length)
        : state.currentSongIndex - 1 < 0
        ? state.currentPlaylist.songs.length - 1
        : state.currentSongIndex - 1;

      state.currentSongIndex = prevIndex;
      const prevSong = state.currentPlaylist.songs[prevIndex];
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
    togglePlay: (state, action) => {
      state.isPlaying = action.payload;
    },
    resetPlaylistState: (state) => {
      state.currentPlaylist = null;
      state.selectedSong = null;
      state.showPlaylistContent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaylistsByUserId.fulfilled, (state, action) => {
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
        // Cập nhật trực tiếp currentPlaylist với dữ liệu từ API
        state.currentPlaylist = action.payload;
        state.loading = false;
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
} = playlistSlice.actions;

export default playlistSlice.reducer;
