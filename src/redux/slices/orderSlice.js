import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllOrdersApi } from "../../api/orderApi";

export const fetchAllOrder = createAsyncThunk(
    "order/fetchAllOrder",
    async ({ userId, pageNumber, pageSize }) => {
        try {
            const response = await fetchAllOrdersApi({ userId, pageNumber, pageSize });
            return response;
        } catch (err) {
            throw err;
        }
    }
)

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchAllOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
