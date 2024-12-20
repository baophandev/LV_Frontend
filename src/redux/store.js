import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../redux/slices/categorySlice"
import productReducer from "../redux/slices/productSlice"


const store = configureStore({
  reducer: {
    categorys: categoryReducer, // State của người dùng được quản lý bởi usersSlice
    product: productReducer
  },
});

export default store;
