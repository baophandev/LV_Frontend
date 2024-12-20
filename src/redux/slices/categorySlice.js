import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCategoryApi } from "../../api/categoryApi";

export const fetchCategorys= createAsyncThunk('category/fetchCategorys', async () => {
  const data = await fetchCategoryApi();
  return data;
});

const categorySlice = createSlice({
  name: "categorys",
  initialState: {
    categorys: [], // Danh sách category
    status: "idle", // Trạng thái của API (idle, loading, succeeded, failed)
    error: null, // Thông báo lỗi nếu có
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchCategorys.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchCategorys.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.categorys = action.payload;
    })
    .addCase(fetchCategorys.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

// Export reducer để sử dụng trong store
export default categorySlice.reducer;
