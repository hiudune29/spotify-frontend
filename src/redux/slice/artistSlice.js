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
export const fetchArtistsSelect = createAsyncThunk(
  "artist/fetchArtistsSelect",
  async (thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/artist/allstatus",
        {
          params: {
            pageNo: 0,
            pageSize: 1000, // để lấy tất cả
            sortBy: "name",
            sortDir: "asc",
            status: true, // hoặc false tùy bạn muốn lấy active hay đã bị disable
          },
        }
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
  },
  reducers: {
    // Nếu có thêm action khác như add/update/delete thì viết ở đây
  },
  extraReducers: (builder) => {
    builder
      // lấy dữ liệu all artist
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      //lấy dữ liệu all artist Select
      .addCase(fetchArtistsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // xử lý true/false status
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

export const selectItemsArtist = (state) => {
  return state.artist.items; // trả về mảng artist
};

export default artistSlice.reducer;
