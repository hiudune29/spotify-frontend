import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all playlists
export const fetchPlaylistsAdmin = createAsyncThunk(
  "playlistAdmin/fetchPlaylistsAdmin",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/playlists/page?pageNo=${pageNo}&pageSize=${pageSize}`
      );

      const result = res.data.result;

      // Gọi API lấy danh sách bài hát từng playlist
      const playlistsWithSongs = await Promise.all(
        result.content.map(async (playlist) => {
          try {
            const songsRes = await axios.get(
              `http://localhost:8080/api/playlists/song/${playlist.playlistId}`
            );

            return {
              ...playlist,
              songs: songsRes.data.result, // <-- gắn thêm danh sách bài hát
            };
          } catch (err) {
            console.error(
              "Failed to fetch songs for playlist",
              playlist.playlistId,
              err
            );
            return { ...playlist, songs: [] }; // fallback nếu lỗi
          }
        })
      );

      return {
        ...result,
        content: playlistsWithSongs,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

// Fetch playlist by ID
export const fetchPlaylistAdminById = createAsyncThunk(
  "playlistAdmin/fetchPlaylistAdminById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/playlists/${playlistId}`
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);
// Create new playlist
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "playlistDto",
        new Blob(
          [
            JSON.stringify({
              name: playlistData.name,
              description: playlistData.description,
              isPrivate: playlistData.isPrivate,
              userId: playlistData.userId,
            }),
          ],
          { type: "application/json" }
        )
      );
      if (playlistData.coverImage?.[0]?.originFileObj) {
        formData.append("img", playlistData.coverImage[0].originFileObj);
      }

      const res = await axios.post(
        "http://localhost:8080/api/playlist/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

// Update playlist
export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "playlistDto",
        new Blob(
          [
            JSON.stringify({
              playlistId: playlistData.playlistId,
              name: playlistData.name,
              description: playlistData.description,
              isPrivate: playlistData.isPrivate,
              userId: playlistData.userId,
            }),
          ],
          { type: "application/json" }
        )
      );
      if (playlistData.coverImage?.[0]?.originFileObj) {
        formData.append("img", playlistData.coverImage[0].originFileObj);
      }

      const res = await axios.put(
        `http://localhost:8080/api/playlist/${playlistData.playlistId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

// Toggle status
export const togglePlaylistStatus = createAsyncThunk(
  "playlist/togglePlaylistStatus",
  async (playlistId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/playlist/status/${playlistId}`
      );
      return res.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Toggle failed");
    }
  }
);

const playlistAdminSlice = createSlice({
  name: "playlistAdmin",
  initialState: {
    items: [],
    playlistSongs: [],
    playlistSelected: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchPlaylistAdminById.fulfilled, (state, action) => {
        state.playlistSelected = action.payload;
      })

      .addCase(togglePlaylistStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        if (Array.isArray(state.items.content)) {
          const idx = state.items.content.findIndex(
            (p) => p.playlistId === updated.playlistId
          );
          if (idx !== -1) state.items.content[idx] = updated;
        }

        if (Array.isArray(state.items)) {
          const idx = state.items.findIndex(
            (p) => p.playlistId === updated.playlistId
          );
          if (idx !== -1) state.items[idx] = updated;
        }
      });
  },
});

export const selectItemsPlaylist = (state) => state.playlist.items;
export const selectPlaylist = (state) => state.playlist.playlistSelected;
export default playlistAdminSlice.reducer;
