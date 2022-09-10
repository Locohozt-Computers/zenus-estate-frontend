import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Typography } from "components/atoms";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentMethod,
  getPaymentType,
  getUserProfile,
  postBillPayment,
} from "pages/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentActions,
  paymentSelectors,
} from "store/reducers/payment/paymentSlice";
import {
  currencyFormat,
  formatNameToDisplay,
  truncateLongName,
} from "utils/helpers";
import { PaymentOptionNameEnum, PayStackResponseI } from "api";
import { Loader } from "components/atoms/Loader";
import { notification } from "services";
import { CustomPayStackButton } from "pages/InstantPayPage/PayStackButton";
import { PageProps } from ".";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;

  .paystack-button {
    padding: 14px 82px;
    text-transform: capitalize;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    background-color: var(--blue);
    border-radius: 29px;
    font-family: "Montserrat", sans-serif;
    color: white;

    &:active {
      transform: scale(0.98);
    }
  }

  .summary {
    background: #fdfafd;
    border-radius: 10px;
    width: 100%;
  }

  .summary-field,
  .summary-title {
    border-bottom: 1px solid var(--gray-2);
    padding: 0 50px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    justify-content: space-between;

    span {
      width: 40%;
    }

    :last-child {
      border-bottom: none;
    }
  }

  .summary-title {
    height: 89px;
    width: 100%;

    justify-content: center;
  }
`;

export const PaySummary = ({ page, setPage }: PageProps) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery(
    ["getUserProfile"],
    getUserProfile
  );
  const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery(
    ["getPaymentType"],
    getPaymentType
  );
  const { data: payMethods, isLoading: payMethodsLoading } = useQuery(
    ["getPaymentMethod"],
    getPaymentMethod
  );

  const { mutate, isLoading } = useMutation(postBillPayment);

  const details = useSelector(paymentSelectors.state);

  const dispatch = useDispatch();

  const { setValues } = paymentActions;

  const [payStackBtn, setPayStackBtn] = useState({
    email: "",
    amount: 0,
  });

  const selectedPaymentType = useMemo(
    () => paymentTypes?.find((el) => el.id === details.payment_type_id),
    [details.payment_type_id, paymentTypes]
  );

  const selectedPaymentMethod = useMemo(
    () => payMethods?.find((el) => el.id === details.payment_method_id),
    [details.payment_method_id, payMethods]
  );

  const total = details.final_amount;

  const onPaySuccess = useCallback(
    (pRes?: PayStackResponseI) => {
      mutate(
        {
          amount: details?.amountToCharge || 0,
          fee: details.fees,
          payment_method_id: details.payment_method_id as number,
          payment_type_id: details.payment_type_id as number,
          final_amount: total,
          reference: pRes?.reference,
          trxref: pRes?.trxref,
        },
        {
          onSuccess: (res: Record<string, any>) => {
            queryClient
              .invalidateQueries([
                "paymentType",
                "getDashboard",
                "getAllTransactions",
              ])
              .then(() => {
                dispatch(setValues({ ...details, successResponse: res }));
                setPage(page + 1);
              });
          },
          onError: () => {
            setPage(page + 2);
          },
        }
      );
    },
    [details, dispatch, mutate, page, queryClient, setPage, setValues, total]
  );

  const walletPayment = useCallback(() => {
    if ((profile?.walletBalance || 0) > total) {
      mutate(
        {
          amount: details?.amountToCharge || 0,
          payment_method_id: details.payment_method_id as number,
          payment_type_id: details.payment_type_id as number,
        },
        {
          onSuccess: (res: Record<string, any>) => {
            dispatch(setValues({ ...details, successResponse: res }));
            setPage(page + 1);
          },
          onError: () => {
            setPage(page + 2);
          },
        }
      );

      setPage(page + 1);
    } else {
      notification.error("You don't have enough wallet balance");
    }
  }, [
    details,
    dispatch,
    mutate,
    page,
    profile?.walletBalance,
    setPage,
    setValues,
    total,
  ]);

  useEffect(() => {
    setPayStackBtn({
      email: `${profile?.landlord_email}`,
      amount: total * 100, // convert to kobo
    });
  }, [
    details.amount,
    details.outstandingBalance,
    profile?.landlord_email,
    total,
  ]);

  return (
    <StyledDiv>
      <Loader
        open={
          isLoading ||
          payMethodsLoading ||
          paymentTypesLoading ||
          profileLoading
        }
        absolute
      />
      <span style={{ alignSelf: "flex-start" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content={`You are about to pay ${currencyFormat(total)}`}
        />
      </span>
      <div className="summary">
        <div className="summary-title">
          <Typography textColor="blue">
            {selectedPaymentType?.special_name}
          </Typography>
        </div>
        <div className="summary-field">
          <span>Name</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={formatNameToDisplay(profile?.tenant_name)}
          />
        </div>
        <div className="summary-field">
          <span>Address</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            title={profile?.address}
            content={truncateLongName(profile?.address || "")}
          />
        </div>
        <div className="summary-field">
          <span>
            {selectedPaymentMethod?.name === PaymentOptionNameEnum.Wallet
              ? "Wallet"
              : "Pay stack"}{" "}
            fees
          </span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={currencyFormat(details.fees)}
          />
        </div>
        <div className="summary-field">
          <span>Type</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={selectedPaymentType?.special_name}
          />
        </div>
        <div className="summary-field">
          <span>Charges</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={`${currencyFormat(
              Math.abs(details?.amountToCharge || 0)
            )}`}
          />
        </div>
        <div className="summary-field" style={{ height: "89px" }}>
          <span>Total</span>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content={`${currencyFormat(total)}`}
          />
        </div>
      </div>
      {selectedPaymentMethod?.name === PaymentOptionNameEnum.Wallet ? (
        <Button
          text={`Pay ${currencyFormat(total)}`}
          onClick={walletPayment}
          disabled={!total}
        />
      ) : (
        <CustomPayStackButton
          {...payStackBtn}
          onSuccess={onPaySuccess}
          buttonProps={{
            disabled: !total,
            text: `Pay ${currencyFormat(total)}`,
          }}
        />
      )}
    </StyledDiv>
  );
};
