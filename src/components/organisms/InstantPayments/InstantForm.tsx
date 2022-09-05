import React, { useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import {
  paymentSelectors,
  paymentActions,
} from "store/reducers/payment/paymentSlice";
import { Input, Button, FormikSelect, Typography } from "components/atoms";

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const validationSchema = yup.object({
  block: VALIDATIONS.address,
  paymentSelect: VALIDATIONS.select,
});

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const InstantForm = ({ page, setPage }: Props) => {
  const formik = useFormik({
    initialValues: { block: "", paymentSelect: "" },
    validationSchema,
    onSubmit: (values) => {
      setPage(page + 1);
    },
  });

  // requests
  const address = useQuery(["getAdress"], getUserProfile).data?.address;
  const balance = useQuery(["getOustandingBalance"], getOustandingBalance).data
    ?.data.data.user_levy_outstanding_balance;

  const paymentList = useSelector(paymentSelectors.paymentType);
  console.log(paymentList);
  const dispatch = useDispatch();

  //  const PaymentTypes = useQuery(["getPaymentType"], paymentType).data;
  //  const balance = useQuery(["getOustandingBalance"], getOustandingBalance).data
  //    ?.data.data.user_levy_outstanding_balance;

  //  const newPaymentTypes = PaymentTypes?.map((item) => {
  //    return item.special_name;
  //  });
  // const { setPaymentType } = paymentActions;

  //   useEffect(() => {
  //     dispatch(setPaymentType( useQuery(["getPaymentType"], paymentType).data
  // ));

  //   }, [dispatch, paymentType, setPaymentType]);

  // console.log(paymentType);

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
          name="block"
          placeholder="12 Okue Street, Okota."
          options={[`${address} || loading`]}
        />
        <FormikSelect
          name="paymentSelect"
          placeholder="Service Charge Fee"
          options={paymentList || []}
          label="Payment type"
        />
        <Input
          label="Outstanding Payment Balance"
          name="block"
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
