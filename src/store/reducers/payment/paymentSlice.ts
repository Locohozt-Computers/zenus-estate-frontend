import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/reducers/index";

export interface PaymentState {
  paymentType: string;
  address: string;
  payOption: { name: string; fees: number };
  charges: number;
  outstandingBalance: number;
  walletBalance: number;
}

const initialState: PaymentState = {
  paymentType: "",
  address: "",
  payOption: { name: "", fees: 0 },
  outstandingBalance: 0,
  charges: 0,
  walletBalance: 10,
};

export interface Item {
  special_name: string;
}

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setValues: (state, action) => {
      state.paymentType = action.payload.values.paymentSelect;
      state.address = action.payload.values.address;
      state.charges = action.payload.chosenType.invoice_amount;
      // state.outstandingBalance = action.payload.balance;
    },
    setFees: (state, action) => {
      state.payOption = action.payload;
    },
  },
});

export const paymentActions = { ...paymentSlice.actions };

export const paymentSelectors = {
  paymentType: (state: RootState) => state.payment.paymentType,
  address: (state: RootState) => state.payment.address,
  charges: (state: RootState) => state.payment.charges,
};

export default paymentSlice.reducer;
