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
      // watch for redirect in url
      const query = new URLSearchParams(window.location.search);
      const url = query.get("redirect");
      if (url) window.location.replace(url);
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

export const authActions = { ...authDocSlice.actions };

export const authSelectors = {
  isAuth: (state: RootState) => state.auth.authenticated,
  profileId: (state: RootState) => state.auth.user.profile_id,
  userId: (state: RootState) => state.auth.user.user_id,
  token: (state: RootState) => state.auth.user.token,
};

export default authDocSlice.reducer;
