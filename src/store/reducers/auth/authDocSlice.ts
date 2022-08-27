import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostUserLogin } from "api";

export interface AuthState {
  user: "";
}

export const loginAsync = createAsyncThunk("auth/login", () => {
  return {};
});

export const authDocSlice = createSlice({
  name: "auth",
  initialState: {
    token: "",
  },
  reducers: {
    authUser: (
      state,
      action: PayloadAction<typeof PostUserLogin.Res["data"]>
    ) => {
      state.token = action.payload.auth.token;
    },
  },
  extraReducers: () => {},
});

export const authActions = { ...authDocSlice.actions, loginAsync };

export default authDocSlice.reducer;
