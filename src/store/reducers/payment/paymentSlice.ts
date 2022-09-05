import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/reducers/index";
import { useQuery } from "@tanstack/react-query";
import {
  getOustandingBalance,
  getUserProfile,
  paymentType,
} from "pages/request";

export interface PaymentState {
  username: string;
  paymentType: string[];
  address: string;
  payOptionFee: number;
  charges: number;
  total: number;
}

const initialState: PaymentState = {
  username: "",
  paymentType: ["abc", "bcd"],
  address: "",
  payOptionFee: 0,
  charges: 0,
  total: 0,
};

export interface Item {
  special_name: string;
}

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentType: (state, action) => {
      //   state.paymentType = action.payload?.map((item: Item) => {
      //     return item.special_name;
      //   });
      state.paymentType = ["abc", "bcd"];
    },
  },
});

export const paymentActions = { ...paymentSlice.actions };

export const paymentSelectors = {
  paymentType: (state: RootState) => state.payment.paymentType,
};

export default paymentSlice.reducer;
