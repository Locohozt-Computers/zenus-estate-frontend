import React, { ChangeEvent, useMemo } from "react";
import styled from "styled-components";
import { FormikProvider, useFormik } from "formik";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import { getPaymentType } from "pages/request";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentActions,
  paymentSelectors,
} from "store/reducers/payment/paymentSlice";
import { Button, Typography, Select, Input } from "components/atoms";
import { currencyFormat, getBalColor } from "utils/helpers";
import { PageProps } from "./Props";

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
`;

const validationSchema = yup.object({
  payment_type_id: VALIDATIONS.paymentType,
});

export const InstantForm = ({ page, setPage }: PageProps) => {
  const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery(
    ["paymentType"],
    getPaymentType
  );

  const details = useSelector(paymentSelectors.state);

  const dispatch = useDispatch();

  const { setValues } = paymentActions;

  const paymentTypesOptions = useMemo(() => {
    if (paymentTypes) {
      return paymentTypes.map((item) => ({
        label: item.special_name,
        value: item.id,
      }));
    }
    return [];
  }, [paymentTypes]);

  const formik = useFormik({
    initialValues: {
      amount: currencyFormat(details.amount || 0),
      payment_type_id: details.payment_type_id as number,
      outstandingBalance: currencyFormat(details.outstandingBalance || 0),
      fees: details.fees,
      final_amount: details.final_amount,
    },
    validationSchema,
    onSubmit: (values) => {
      const oustd = +currencyFormat.removeFormat(values.outstandingBalance);
      const amt = +currencyFormat.removeFormat(values.amount);
      dispatch(
        setValues({
          ...values,
          amountToCharge: oustd >= 0 ? amt : Math.abs(oustd),
          payment_type_id: +values.payment_type_id,
          amount: amt,
          outstandingBalance: oustd,
        })
      );
      setPage(page + 1);
    },
  });

  const handlePaymentType = (e: ChangeEvent<HTMLSelectElement>) => {
    const pos = e.target.options[e.target.selectedIndex].dataset.pos;
    if (pos && paymentTypes) {
      formik.setFieldValue(e.target.name, e.target.value);
      formik.setFieldValue(
        "amount",
        currencyFormat(paymentTypes[+pos].invoice_amount)
      );
      formik.setFieldValue(
        "outstandingBalance",
        currencyFormat(paymentTypes[+pos].user_levy_outstanding_balance)
      );
      formik.setFieldValue("fees", paymentTypes[+pos].fees);
      formik.setFieldValue("final_amount", paymentTypes[+pos].final_amount);
    }
  };

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={formik.handleSubmit} className="form-section">
        <div style={{ alignSelf: "flex-start" }}>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content=" Pay your bills in few minutes"
          />
        </div>
        <Select
          name="payment_type_id"
          options={paymentTypesOptions}
          value={formik.values.payment_type_id}
          placeholder="Select Service Fee"
          label="Payment type"
          loading={paymentTypesLoading}
          onChange={handlePaymentType}
          error={
            formik.errors.payment_type_id &&
            formik.touched.payment_type_id &&
            formik.errors.payment_type_id
          }
        />
        <Input
          value={formik.values.amount}
          readOnly
          label="Amount"
          name="amount"
        />
        <Input
          label="Account Balance"
          name="outstandingBalance"
          value={formik.values.outstandingBalance}
          readOnly
          style={{
            color: getBalColor(
              +currencyFormat.removeFormat(formik.values.outstandingBalance)
            ),
            pointerEvents: "none",
          }}
        />
        <Button text="Next" type="submit" disabled={paymentTypesLoading} />
      </StyledForm>
    </FormikProvider>
  );
};
