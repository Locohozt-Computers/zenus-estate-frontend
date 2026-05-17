import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./auth/authDocSlice";
import paymentReducer, { PaymentState } from "./payment/paymentSlice";
import clientReducer, { ClientState } from "./client/clientSlice";
import settingsReducer, { SettingsState } from "./settings/settingsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
  client: clientReducer,
  settings: settingsReducer,
});

export interface RootState {
  auth: AuthState;
  payment: PaymentState;
  client: ClientState;
  settings: SettingsState;
}
