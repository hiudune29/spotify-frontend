import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8080/api/search", {
        params: {
          keyword: keyword,
        },
      });
      return response.data.result;
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
    showPlaylist: false,
    selectedPlaylist: null,
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
    setShowPlaylist: (state, action) => {
      state.showPlaylist = action.payload.show;
      state.selectedPlaylist = action.payload.playlist || null;
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

export const {
  setSearchQuery,
  clearSearchQuery,
  setShowUserProfile,
  setShowPlaylist,
} = searchSlice.actions;

export default searchSlice.reducer;
