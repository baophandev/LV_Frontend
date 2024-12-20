import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {fetchProducstApi, fetchProductApi} from "../../api/productApi"


export const fetchProducts = createAsyncThunk("product/fecthProducts", async (pageNumber, pageSize) => {
  const data = await fetchProducstApi(pageNumber, pageSize);
  return data;
});

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (productId) => {
    const data = await fetchProductApi(productId);
    return data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    status: "idle",
    error: null,
    page: {
      currentPage: 0,
      totalPages : 0,
    },
  },
  reducers: {
    setPage: (state, action) => {
        state.page.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.page.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {setPage} = productSlice.actions;
export default productSlice.reducer;