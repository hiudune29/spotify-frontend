import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: "",
    showUserProfile: false, // Thêm trạng thái mới
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
    setShowUserProfile: (state, action) => {
      // Action để hiển thị UserProfile
      state.showUserProfile = action.payload;
    },
  },
});

export const { setSearchQuery, clearSearchQuery, setShowUserProfile } =
  searchSlice.actions;
export default searchSlice.reducer;
