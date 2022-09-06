import React from "react";
import styled from "styled-components";
import { FormikProvider, useFormik } from "formik";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import {
  getOustandingBalance,
  getUserProfile,
  paymentType,
} from "pages/request";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "store/reducers/payment/paymentSlice";
import { Input, Button, FormikSelect, Typography } from "components/atoms";
import { RootState } from "store/reducers";

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const validationSchema = yup.object({
  address: VALIDATIONS.address,
  paymentSelect: VALIDATIONS.select,
});

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const InstantForm = ({ page, setPage }: Props) => {
  const details = useSelector((state: RootState) => state.payment);
  const initpaymentType = details.paymentType;
  const initAddress = details.address;
  const dispatch = useDispatch();
  const { setValues } = paymentActions;
  const address = useQuery(["getAdress"], getUserProfile).data?.address;
  const paymentTypes = useQuery(["getPaymentType"], paymentType).data;
  const paymentTypesName = paymentTypes?.map((item) => item.special_name);
  const balance = useQuery(["getOustandingBalance"], getOustandingBalance).data
    ?.data.data.user_levy_outstanding_balance;

  const formik = useFormik({
    initialValues: {
      address: initAddress,
      paymentSelect: initpaymentType,
    },
    validationSchema,
    onSubmit: (values) => {
      const chosenType = paymentTypes?.find((item) => {
        return item.special_name === values.paymentSelect;
      });
      setPage(page + 1);
      dispatch(setValues({ values, chosenType }));
    },
  });

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={formik.handleSubmit} className="form-section">
        <span style={{ alignSelf: "flex-start" }}>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content=" Pay your bills in few minutes"
          />
        </span>
        <FormikSelect
          label="Block Address"
          name="address"
          placeholder="12 Okue Street, Okota."
          options={[`${address}`]}
        />
        <FormikSelect
          name="paymentSelect"
          placeholder="Service Charge Fee"
          options={paymentTypesName || []}
          label="Payment type"
        />
        <Input
          label="Outstanding Payment Balance"
          name="balance"
          value={balance}
          readOnly
          style={{
            color: "var(--blue)",
            fontWeight: "500",
            fontSize: " 17px",
            width: "572px",
          }}
        />
        <Button text="Next" type="submit" />
      </StyledForm>
    </FormikProvider>
  );
};
