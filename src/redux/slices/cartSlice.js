import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCartApi } from "../../api/cartApi";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await fetchCartApi(userId);
  return response;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {},
    count: 0,
    status: "idle",
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.count = Object.keys(action.payload?.data?.items || {}).length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
