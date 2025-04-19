import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsersSelect = createAsyncThunk(
  "songAdmin/fetchUsersSelect",
  async (thunkAPI) => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/user/status",
        {
          params: {
            status: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState: {
    items: [],
    userSelected: {},
  },
  reducers: {
    resetSongSelected: (state) => {
      state.songSelected = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersSelect.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { resetSongSelected } = userAdminSlice.actions;
export default userAdminSlice.reducer;
export const selectItemsUserAdmin = (state) => state.userAdmin.items;
export const selectUserAdminSelected = (state) => state.userAdmin.userSelected;
