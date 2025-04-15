import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action để fetch danh sách album
export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/album/all?pageNo=${pageNo}&pageSize=${pageSize}`
      );
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
export const toggleAlbumStatus = createAsyncThunk(
  "album/updateStatus",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/album/status/${albumId}`
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
const albumSlice = createSlice({
  name: "album",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Nếu có thêm action khác như add/update/delete thì viết ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleAlbumStatus.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;

        if (Array.isArray(state.items.content)) {
          const index = state.items.content.findIndex(
            (item) => item.albumId === updatedAlbum.albumId
          );
          if (index !== -1) {
            state.items.content[index] = updatedAlbum;
          }
        }

        if (Array.isArray(state.items)) {
          const index = state.items.findIndex(
            (item) => item.albumId === updatedAlbum.albumId
          );
          if (index !== -1) {
            state.items[index] = updatedAlbum;
          }
        }
      });
  },
});
export default albumSlice.reducer;
