import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const decodeJwt = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded);
    return decoded.userId;
  } catch (error) {
    console.error("Lỗi khi decode JWT:", error);
    return null;
  }
};

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token trong localStorage:", token); // Debug ngay từ đầu
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      console.log("Token gửi đi:", token);
      const decodedToken = decodeJwt(token); // Decode trước khi gửi
      if (!decodedToken) {
        throw new Error("Token không hợp lệ, không thể decode.");
      }

      const response = await fetch("http://localhost:8082/api/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lấy thông tin lỗi từ response
        throw new Error(
          `Lỗi API: ${response.status} - ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch user info:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    userId: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.userInfo = null;
      state.userId = null;
      state.role = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.role = action.payload.role || null;
        const token = localStorage.getItem("token");
        state.userId = token ? decodeJwt(token) : null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
        state.userId = null;
        state.role = null;
        localStorage.removeItem("token");
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
