import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../redux/slices/categorySlice";
import productReducer from "../redux/slices/productSlice";
import cartReducer from "../redux/slices/cartSlice";
import authReducer from "../redux/slices/authSlice"
import userReducer from "../redux/slices/userSlice"
import orderReducer from "../redux/slices/orderSlice"

const store = configureStore({
  reducer: {
    categorys: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    auth : authReducer,
    user : userReducer,
    order: orderReducer,
  },
});

export default store;
