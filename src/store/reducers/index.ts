import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./auth/authDocSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
});

export interface RootState {
  auth: AuthState;
}
