import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostUserLogin, setAuthorizationHeader } from "api";
import { RootState } from "store/reducers/index";

export interface AuthState {
  user: {
    token: string | null;
    profile_id: number | null;
    user_id: number | null;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
  };
  wallet: {
    currency: string;
  };
  authenticated: boolean;
  pin_is_set: boolean;
}

const initialState: AuthState = {
  user: {
    token: null,
    profile_id: null,
    user_id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: null,
  },
  wallet: {
    currency: "NGN",
  },
  authenticated: false,
  pin_is_set: false,
};

export const authDocSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUser: (
      state,
      action: PayloadAction<typeof PostUserLogin.Res["data"]>
    ) => {
      const { auth, profile, user, wallet } = action.payload;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { pin_is_set } = action.payload;
      setAuthorizationHeader(auth.token);
      state.authenticated = !!auth.token;
      state.user.token = auth.token;
      state.user.profile_id = profile.id;
      state.user.user_id = profile.user_id;
      state.user.first_name = profile.first_name;
      state.user.last_name = profile.last_name;
      state.user.email = user.email;
      state.user.phone_number = user.phone_number;
      state.wallet.currency = wallet.currency;
      state.pin_is_set = pin_is_set ?? false;
      // watch for redirect in url
      const query = new URLSearchParams(window.location.search);
      const url = query.get("redirect");
      if (url) window.location.replace(url);
    },
    setPinIsSet: (state, action: PayloadAction<boolean>) => {
      state.pin_is_set = action.payload;
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
  user: (state: RootState) => state.auth.user,
  pinIsSet: (state: RootState) => state.auth.pin_is_set,
  firstName: (state: RootState) => state.auth.user.first_name,
  lastName: (state: RootState) => state.auth.user.last_name,
  email: (state: RootState) => state.auth.user.email,
  phoneNumber: (state: RootState) => state.auth.user.phone_number,
  walletCurrency: (state: RootState) => state.auth.wallet.currency,
};

export default authDocSlice.reducer;
