import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchArtists = createAsyncThunk(
  "artist/fetchArtists",
  async ({ pageNo, pageSize } = {}, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/artist/all?pageNo=${pageNo}&pageSize=${pageSize}`
      );
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
export const toggleArtistStatus = createAsyncThunk(
  "artist/updateStatus",
  async (artistId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/artist/status/${artistId}`
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const artistSlice = createSlice({
  name: "artist",
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
      .addCase(fetchArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleArtistStatus.fulfilled, (state, action) => {
        const updatedArtist = action.payload;

        if (Array.isArray(state.items.content)) {
          const index = state.items.content.findIndex(
            (item) => item.artistId === updatedArtist.artistId
          );
          if (index !== -1) {
            state.items.content[index] = updatedArtist;
          }
        }

        if (Array.isArray(state.items)) {
          const index = state.items.findIndex(
            (item) => item.artistId === updatedArtist.artistId
          );
          if (index !== -1) {
            state.items[index] = updatedArtist;
          }
        }
      });
  },
});

export default artistSlice.reducer;
