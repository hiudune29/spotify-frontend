import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action để fetch danh sách album
export const fetchSongsAdmin = createAsyncThunk(
  "songAdmin/fetchSongsAdmin",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/songs/pageAdmin?pageNo=${pageNo}&pageSize=${pageSize}`
      );
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
export const toggleSongStatus = createAsyncThunk(
  "songAdmin/updateSongStatus",
  async (songId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/songs/status/${songId}`
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const songAdminSlice = createSlice({
  name: "songAdmin",
  initialState: {
    items: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsAdmin.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleSongStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        if (Array.isArray(state.items.content)) {
          const idx = state.items.content.findIndex(
            (p) => p.songId === updated.songId
          );
          if (idx !== -1) state.items.content[idx] = updated;
        }

        if (Array.isArray(state.items)) {
          const idx = state.items.findIndex((p) => p.songId === updated.songId);
          if (idx !== -1) state.items[idx] = updated;
        }
      });
  },
});

export default songAdminSlice.reducer;
