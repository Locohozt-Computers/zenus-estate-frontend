import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/reducers/index";
import { PostBillPayment } from "api";

export interface PaymentState {
  payment_type_id: number | null;
  amount: number | null;
  outstandingBalance: number;
  payment_method_id: number | null;
  fees: number;
  final_amount: number;
  successResponse: Partial<typeof PostBillPayment.Res>;
}

const initialState: PaymentState = {
  payment_type_id: null,
  amount: 0,
  outstandingBalance: 0,
  payment_method_id: null,
  successResponse: {},
  fees: 0,
  final_amount: 0,
};

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
      if (action.payload.outstandingBalance) {
        state.outstandingBalance = action.payload.outstandingBalance || 0;
      }
      state.fees = action.payload.fees || 0;
      state.final_amount = action.payload.final_amount || 0;
    },
    resetValues: () => {
      return initialState;
    },
  },
});

export const paymentActions = { ...paymentSlice.actions };

export const paymentSelectors = {
  paymentTypeId: (state: RootState) => state.payment.payment_type_id,
  paymentMethodId: (state: RootState) => state.payment.payment_method_id,
  state: (state: RootState) => state.payment,
};

export default paymentSlice.reducer;
