import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeView: "home", // mặc định là giao diện chính
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
  },
});

export const { setActiveView } = uiSlice.actions;
export default uiSlice.reducer;
