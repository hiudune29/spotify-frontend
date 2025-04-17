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
export const fetchAlbumById = createAsyncThunk(
  "album/fetchAlbumById",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/album/${albumId}`);
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
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
export const fetchAlbumsSelect = createAsyncThunk(
  "artist/fetchAlbumsSelect",
  async (thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/album/allstatus", {
        params: {
          pageNo: 0,
          pageSize: 1000, // để lấy tất cả
          sortBy: "title",
          sortDir: "asc",
          status: true, // hoặc false tùy bạn muốn lấy active hay đã bị disable
        },
      });
      return res.data.result; // <-- chỉ lấy phần `result` trong ApiResponse
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "albumRequestDTO",
        new Blob(
          [
            JSON.stringify({
              title: albumData.title,
              releaseDate: albumData.releaseDate,
              artistId: albumData.artistId,
              type: albumData.type,
            }),
          ],
          { type: "application/json" }
        )
      );
      // Kiểm tra xem albumData.image có tồn tại và image[0] có tồn tại originFileObj không
      formData.append("coverImage", albumData.image[0].originFileObj);

      const res = await axios.post(
        "http://localhost:8080/api/album/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.result;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const updateAlbum = createAsyncThunk(
  "album/updateAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(
        "albumUpdateDTO",
        new Blob(
          [
            JSON.stringify({
              albumId: albumData.albumId,
              title: albumData.title,
              releaseDate: albumData.releaseDate,
              artistId: albumData.artistId,
              type: albumData.type,
            }),
          ],
          { type: "application/json" }
        )
      );
      formData.append("coverImage", albumData.image[0].originFileObj);

      const res = await axios.put(
        "http://localhost:8080/api/album/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
    albumSelected: {},
  },
  reducers: {
    // Nếu có thêm action khác như add/update/delete thì viết ở đây
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAlbumById.fulfilled, (state, action) => {
        state.albumSelected = action.payload;
      })
      .addCase(fetchAlbumsSelect.fulfilled, (state, action) => {
        state.items = action.payload;
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

export const selectItemsAlbum = (state) => {
  return state.album.items; // trả về mảng artist
};
export const selectAlbum = (state) => {
  return state.album.albumSelected; // trả về album được chọn
};

export default albumSlice.reducer;
