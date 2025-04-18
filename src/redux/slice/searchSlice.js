import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk để fetch kết quả tìm kiếm từ backend
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      // Sử dụng GET với params để gửi keyword qua query parameter
      const response = await axios.get("http://localhost:8080/api/search", {
        params: {
          keyword: keyword, // Truyền keyword qua params
        },
      });
      return response.data.result; // result bên trong ApiResponse<searchResponse>
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: "",
    showUserProfile: false,
    searchResults: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
      state.searchResults = null;
      state.error = null;
    },
    setShowUserProfile: (state, action) => {
      state.showUserProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// ✅ Export action creators
export const { setSearchQuery, clearSearchQuery, setShowUserProfile } =
  searchSlice.actions;

// ✅ Export reducer
export default searchSlice.reducer;
