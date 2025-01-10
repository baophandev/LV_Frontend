import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../redux/slices/categorySlice";
import productReducer from "../redux/slices/productSlice";
import cartReducer from "../redux/slices/cartSlice";

const store = configureStore({
  reducer: {
    categorys: categoryReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export default store;
