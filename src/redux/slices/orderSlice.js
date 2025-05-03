import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReduxStuatus } from "../../enums/Status";
import { fetchOrdersApi } from "../../api/orderApi";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({ pageNumber, pageSize, status, userId }) => {
    const response = await fetchOrdersApi({ pageNumber, pageSize, status, userId });
    return {
      ...response,
      statusKey: status,
    };
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderByStatus: {},
    status: ReduxStuatus.IDLE,
    error: null,
    currentPage: 1,
    totalPages: 0,
  },
  reducers: {
    localUpdateStatus: (state, action) => {
      const { orderId, oldStatus, newStatus } = action.payload;

      //Tìm order trong oldStatus list
      const oldOrders = state.orderByStatus[oldStatus] || [];
      const orderIndex = oldOrders.findIndex((order) => order.id === orderId);

      if (orderIndex !== -1) {
        const [updatedOrder] = oldOrders.splice(orderIndex, 1);
        updatedOrder.status = newStatus;

        //Thêm order vào newStatus list
        if (!state.orderByStatus[newStatus]) {
          state.orderByStatus[newStatus] = [];
        }

        state.orderByStatus[newStatus].unshift(updatedOrder);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = ReduxStuatus.LOADING;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = ReduxStuatus.SUCCEEDED;
        const { statusKey, content, pageNumber, totalPages } = action.payload;
        state.orderByStatus[statusKey] = content;
        state.currentPage = pageNumber;
        state.totalPages = totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = ReduxStuatus.FAILED;
        state.error = action.error.message;
      });
  },
});

export const { localUpdateStatus } = orderSlice.actions;
export default orderSlice.reducer;
