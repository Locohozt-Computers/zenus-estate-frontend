import React, { useMemo } from "react";
import styled from "styled-components";
import { Button, FormikInput, Typography } from "components";
import { pxToEm } from "utils";
import { AiOutlinePlus } from "react-icons/ai";
import { PropsI } from "pages/WalletPage/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getBankAccounts, walletTransferBank } from "pages/WalletPage/request";
import {
  getAllBanks,
  getUserProfile,
  getWalletTransactions,
} from "pages/request";
import { Loader } from "components/atoms/Loader";
import { currencyFormat, getInitials } from "utils/helpers";
import { FormikProvider, useFormik } from "formik";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import { notification } from "services";
import { getAllNotifications } from "components/organisms/NotificationDropdown/request";

const StyledDiv = styled.div`
  position: relative;

  .saved-account {
    padding: ${pxToEm(35)};
    height: ${pxToEm(185)};
    background: #fdfafd;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 20px;

    &-text {
      align-items: flex-start;
      align-self: flex-start;
      flex-direction: column;
      margin-left: ${pxToEm(22)};
      min-height: ${pxToEm(90)};
    }
  }

  .initials {
    border-radius: 22.5px;
    width: 85px;
    height: 85px;
    object-fit: cover;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--gray);
  }

  .withdraw-btn {
    margin-bottom: ${pxToEm(75)};
    margin-top: ${pxToEm(60)};
  }
  .withdraw-btn .amount {
    display: none;
  }

  @media screen and (min-width: ${pxToEm(750)}) {
    .withdraw-btn .amount {
      display: inline;
    }
  }
`;

const truncate = (str: string) => `${str.slice(0, 2)}****${str.slice(6)}`;

export const WithdrawView = ({ setPage }: PropsI) => {
  const {
    isLoading: profileLoading,
    data: profileData,
    refetch,
  } = useQuery([getUserProfile.key], getUserProfile, {
    cacheTime: 0,
  });

  const { refetch: refetchNotification } = useQuery(
    [getAllNotifications.key],
    getAllNotifications
  );

  const { data: banks, isLoading: bankLoading } = useQuery(
    [getAllBanks.key],
    getAllBanks
  );

  const { data: bankAccounts, isLoading } = useQuery(
    [getBankAccounts.key],
    getBankAccounts
  );

  const { mutate, isLoading: withdrawalLoading } =
    useMutation(walletTransferBank);

  const { refetch: refetchTransaction } = useQuery(
    [getWalletTransactions.key],
    () => getWalletTransactions()
  );

  const bankDetails = useMemo(() => {
    if (bankAccounts) {
      const res = banks?.data.find(
        (el) => el.code.toString() === bankAccounts[0].bank_code.toString()
      );
      return {
        bank: res?.name,
        account: bankAccounts[0].account_name,
        acc_number: bankAccounts[0].account_number,
      };
    }
    return null;
  }, [bankAccounts, banks?.data]);

  const formik = useFormik({
    initialValues: { amount: "" },
    validateOnMount: true,
    validationSchema: yup.object({
      amount: VALIDATIONS.amount.max(
        profileData?.walletBalance as number,
        `Your account balance is ${currencyFormat(
          profileData?.walletBalance || 0
        )}`
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      mutate(
        { amount: +values.amount },
        {
          onSuccess: () => {
            refetch();
            refetchNotification();
            refetchTransaction();
            notification.success(
              `You have successfully withdrawn ${currencyFormat(
                +values.amount
              )}`,
              { position: "top-center" }
            );
            resetForm();
          },
          onError: () => {
            refetchNotification();
            notification.error(
              `Your ${currencyFormat(+values.amount)} withdrawal Has Failed`
            );
          },
        }
      );
    },
  });

  return (
    <StyledDiv>
      <Loader open={bankLoading || isLoading} absolute />
      <div>
        <div className="saved-account">
          <div className="initials">
            <Typography
              variant="heading4"
              color="white"
              content={getInitials(bankDetails?.bank || "")}
            />
          </div>
          <div className="saved-account-text display-flex ">
            <Typography
              variant="heading5"
              content={bankDetails?.bank || "**********"}
            />
            <Typography
              variant="subtitle"
              content={`(${truncate(
                bankDetails?.acc_number || "************"
              )})`}
              textColor="gray-4"
            />
            <Typography variant="bodyBig" textColor="gray-4">
              Recipient Name:{" "}
              <span>{bankDetails?.account || "************"}</span>
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 40,
          }}
        >
          <button
            type="button"
            className="center-contents"
            style={{ color: "var(--blue)" }}
            onClick={() => setPage(!bankAccounts?.length ? 2 : 3)}
          >
            <AiOutlinePlus />
            <Typography
              variant="bodyBig"
              textColor="blue"
              content="Update Account"
            />
          </button>
        </div>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FormikInput
              name="amount"
              placeholder="Amount"
              label="Amount to withdraw"
              numbersOnly
              disabled={withdrawalLoading}
            />
            <Typography
              size={14}
              textColor="med-gray"
              style={{ marginTop: 5 }}
              content={
                profileLoading
                  ? "Getting Balance..."
                  : `Wallet balance ${currencyFormat(
                      profileData?.walletBalance || 0
                    )}`
              }
            />
            <div className="center-contents">
              <Button
                type="submit"
                className="withdraw-btn"
                loading={withdrawalLoading}
                disabled={!formik.isValid}
              >
                <span>Withdraw</span>{" "}
                {!!formik.values.amount && (
                  <span className="amount">
                    {currencyFormat(+formik.values.amount || 0)}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </FormikProvider>
      </div>
    </StyledDiv>
  );
};
