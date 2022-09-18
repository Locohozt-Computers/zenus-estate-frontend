import React, { useMemo } from "react";
import styled from "styled-components";
import { FormikProvider, useFormik } from "formik";
import { Button, FormikInput, FormikSelect } from "components/atoms";
import * as yup from "yup";
import { VALIDATIONS } from "app-constants";
import { useQuery } from "@tanstack/react-query";
import { getAllBanks } from "pages/request";
import {
  addBank,
  getBankAccounts,
  resolveBank,
} from "pages/WalletPage/request";
import { netErrorHandler, notification } from "services";
import { AxiosError } from "axios";
import { PropsI } from "./types";

const validationSchema = yup.object({
  accNumber: VALIDATIONS.accountNumber,
  bankCode: VALIDATIONS.bankName,
});

const StyledDiv = styled.div`
  .form {
    display: grid;
    gap: 30px;
  }
`;

export const AddAccount = ({ setPage }: PropsI) => {
  const { data: banks, isLoading: bankLoading } = useQuery(
    ["getAllBank"],
    getAllBanks
  );

  const { refetch: refetchBankAccounts } = useQuery(
    ["getBankAccounts"],
    getBankAccounts
  );

  const bankList = useMemo(
    () =>
      banks?.data
        .filter((el) => el.currency !== "USD")
        .map((el) => ({
          label: el.name,
          value: el.code,
        })),
    [banks?.data]
  );

  const formik = useFormik({
    initialValues: {
      accNumber: "",
      bankCode: "",
    },
    validationSchema,
    onSubmit: async ({ accNumber, bankCode }) => {
      try {
        await resolveBank({
          account_number: accNumber,
          bank_code: bankCode,
        });
        await addBank({
          account_number: accNumber,
          bank_code: bankCode,
        });
        const bb = await refetchBankAccounts();
        if (bb?.data?.length) {
          setPage(2);
        }
      } catch (e) {
        const message = netErrorHandler(e as AxiosError);
        notification.error(message);
      }
    },
  });

  return (
    <StyledDiv>
      <div className="withdraw-items" />
      <FormikProvider value={formik}>
        <form className="form" onSubmit={formik.handleSubmit}>
          <FormikSelect
            name="bankCode"
            label="Bank Name"
            options={bankList || []}
            loading={bankLoading}
            placeholder="Select Bank"
          />
          <FormikInput
            name="accNumber"
            label="Account Number to Pay"
            placeholder="Account Number"
          />
          <div className="center-contents">
            <Button
              type="submit"
              text="Add Account"
              loading={formik.isSubmitting}
            />
          </div>
        </form>
      </FormikProvider>
    </StyledDiv>
  );
};
