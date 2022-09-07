import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./auth/authDocSlice";
import paymentReducer, { PaymentState } from "./payment/paymentSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  payment: paymentReducer,
});

export interface RootState {
  auth: AuthState;
  payment: PaymentState;
}
