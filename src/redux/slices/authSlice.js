import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("authToken", action.payload);
        }
    }
})

export const {setAuthToken} = authSlice.actions;
export default authSlice.reducer;