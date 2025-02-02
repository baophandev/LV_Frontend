import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("authToken") || null,
  },
  reducers: {},
});

export const {setAuthToken} = authSlice.actions;
export default authSlice.reducer;