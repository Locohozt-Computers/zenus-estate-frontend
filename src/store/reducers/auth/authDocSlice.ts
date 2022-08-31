import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostUserLogin, setAuthorizationHeader } from "api";
import { RootState } from "store/reducers/index";

export interface AuthState {
  user: {
    token: string | null;
    profile_id: number | null;
    user_id: number | null;
  };
  authenticated: boolean;
}

const initialState: AuthState = {
  user: {
    token: null,
    profile_id: null,
    user_id: null,
  },
  authenticated: false,
};

export const authDocSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUser: (
      state,
      action: PayloadAction<typeof PostUserLogin.Res["data"]>
    ) => {
      setAuthorizationHeader(action.payload.auth.token);
      state.authenticated = !!action.payload.auth.token;
      state.user.token = action.payload.auth.token;
      state.user.profile_id = action.payload.profile.profile_id;
      state.user.user_id = action.payload.profile.user_id;
    },
    logoutUser: () => {
      return initialState;
    },
  },
  extraReducers: () => {},
});

export const authActions = { ...authDocSlice.actions };

export const authSelectors = {
  isAuth: (state: RootState) => state.auth.authenticated,
};

export default authDocSlice.reducer;
