import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyInfoApi, getUserAddressApi } from "../../api/userApi";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async (token) => {
  const response = await getMyInfoApi(token);
  return response;
});

export const getUserAddress = createAsyncThunk(
  "user/getUserAddress",
  async ({ token, userId }) => {
    const response = await getUserAddressApi({ token, userId });
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    address: [],
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = {};
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getMyInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getUserAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action.payload;
      })
      .addCase(getUserAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {logout} = userSlice.actions;

export default userSlice.reducer;
