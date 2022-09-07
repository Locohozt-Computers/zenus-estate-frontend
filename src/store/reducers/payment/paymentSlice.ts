import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/reducers/index";
import { PostBillPayment } from "api";

export interface PaymentState {
  payment_type_id: number | null;
  amount: number | null;
  outstandingBalance: number;
  payment_method_id: number | null;

  charges: number;
  successResponse: Partial<typeof PostBillPayment.Res>;
}

const initialState: PaymentState = {
  payment_type_id: 1,
  amount: 0,
  outstandingBalance: 0,
  payment_method_id: null,
  successResponse: {},

  charges: 0,
  // fee: 200,
};

export interface Item {
  special_name: string;
}

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setValues: (state, action: PayloadAction<Partial<PaymentState>>) => {
      if (action.payload.amount) {
        state.amount = +action.payload.amount;
      }
      if (typeof action.payload.payment_type_id === "number") {
        state.payment_type_id = action.payload.payment_type_id;
      }
      if (typeof action.payload.payment_method_id === "number") {
        state.payment_method_id = action.payload.payment_method_id;
      }
      if (action.payload.successResponse) {
        state.successResponse = action.payload.successResponse;
      }
      // if (["string", "number"].includes(typeof action.payload.outStanding)) {
      //   state.outstandingBalance = action.payload.outStanding;
      // }
    },
  },
});

export const paymentActions = { ...paymentSlice.actions };

export const paymentSelectors = {
  paymentTypeId: (state: RootState) => state.payment.payment_type_id,
  paymentMethodId: (state: RootState) => state.payment.payment_method_id,
  charges: (state: RootState) => state.payment.charges,
  state: (state: RootState) => state.payment,
};

export default paymentSlice.reducer;
