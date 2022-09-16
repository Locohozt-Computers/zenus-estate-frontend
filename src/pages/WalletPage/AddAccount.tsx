import React from "react";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import { FormikProvider, useFormik } from "formik";
import {
  FormikInput,
  Button,
  Typography,
  FormikSelect,
} from "components/atoms";
import { AppIcon, pxToEm } from "utils";
import * as yup from "yup";
import { VALIDATIONS } from "app-constants";
import { useQuery } from "@tanstack/react-query";
import { getAllBanks } from "pages/request";
import { IconArrowLeft } from "assets/icons";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .withdraw-items {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
`;
type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const validationSchema = yup.object({
  accName: VALIDATIONS.accountName,
  accNumber: VALIDATIONS.account,
  bankName: VALIDATIONS.bankName,
  amount: VALIDATIONS.amount,
});

export const AddAccount = ({ page, setPage }: Props) => {
  const formik = useFormik({
    initialValues: {
      accName: "",
      accNumber: "",
      bankName: "",
      amount: "",
    },
    validationSchema,
    onSubmit: () => {
      setPage(page + 2);
      //  dispatch(setValues({ values, chosenType }));
    },
  });

  const { data: banks } = useQuery(["getAllBank"], getAllBanks);
  console.log(banks);
  // const BankNames = banks?.map((item)=>{

  // })
  return (
    <StyledDiv>
      <div className="withdraw-items">
        <span className="arrow-icon">
          <Typography
            variant="bodyBig"
            textColor="med-gray"
            content="My wallet/withdraw"
          />
        </span>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FormikInput
              name="accName"
              label="Account Name to Pay"
              placeholder="Daniel Mbazu"
            />
            <FormikInput
              name="accNumber"
              label="Account Number to Pay"
              placeholder="3119378455"
            />
            <FormikSelect
              name="bankName"
              label="Bank Name"
              options={[]}
              placeholder="First Bank PLC"
            />
            <FormikInput
              name="amount"
              label="Amount to Withdraw"
              placeholder="N60,0000"
            />
            <Button text="Withdraw" />
          </form>
        </FormikProvider>
      </div>
    </StyledDiv>
  );
};
