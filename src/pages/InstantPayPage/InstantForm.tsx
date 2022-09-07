import React, { ChangeEvent, useMemo } from "react";
import styled from "styled-components";
import { FormikProvider, useFormik } from "formik";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import { getPaymentType } from "pages/request";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { paymentActions } from "store/reducers/payment/paymentSlice";
import { Button, Typography, FormikInput, Select } from "components/atoms";

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const validationSchema = yup.object({
  amount: VALIDATIONS.amount,
  payment_type_id: VALIDATIONS.paymentType,
});

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const InstantForm = ({ page, setPage }: Props) => {
  const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery(
    ["paymentType"],
    getPaymentType
  );

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
      amount: "",
      payment_type_id: "",
      outstandingBalance: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        setValues({
          payment_type_id: +values.payment_type_id,
          amount: +values.amount,
          outstandingBalance: values.outstandingBalance,
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
        "outstandingBalance",
        paymentTypes[+pos].user_levy_outstanding_balance
      );
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
          placeholder="Service Charge Fee"
          label="Payment type"
          loading={paymentTypesLoading}
          onChange={handlePaymentType}
          error={
            formik.errors.payment_type_id &&
            formik.touched.payment_type_id &&
            formik.errors.payment_type_id
          }
        />
        <FormikInput numbersOnly label="Amount" name="amount" />
        <FormikInput
          label="Outstanding Payment Balance"
          name="outstandingBalance"
          readOnly
          style={{
            color: "var(--blue)",
            pointerEvents: "none",
          }}
        />
        <Button text="Next" type="submit" />
      </StyledForm>
    </FormikProvider>
  );
};
