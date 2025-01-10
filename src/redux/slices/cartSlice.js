import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCartApi } from "../../api/cartApi";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId }) => {
    const response = await fetchCartApi({ userId });
    return response;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
