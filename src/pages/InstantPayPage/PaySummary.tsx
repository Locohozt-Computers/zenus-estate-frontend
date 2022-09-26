import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Typography } from "components/atoms";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTransactions,
  getDashboard,
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
import { getAllNotifications } from "components/organisms/NotificationDropdown/request";
import { pxToEm } from "utils";
import { PageProps } from "./Props";

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
    padding: 10px;
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

  @media screen and (min-width: ${pxToEm(900, false)}) {
    .summary-field {
      padding: 0 50px;
    }
  }
`;

export const PaySummary = ({ page, setPage }: PageProps) => {
  const queryClient = useQueryClient();

  const details = useSelector(paymentSelectors.state);

  const { data: payMethods, isLoading: payMethodsLoading } = useQuery(
    [getPaymentMethod.key],
    getPaymentMethod
  );

  const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery(
    [getPaymentType.key],
    getPaymentType
  );

  const { refetch: refetchNotifications } = useQuery(
    [getAllNotifications.key],
    getAllNotifications
  );

  const { mutate, isLoading } = useMutation(postBillPayment);

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

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery([getUserProfile.key], getUserProfile, {
    enabled: selectedPaymentMethod?.name === PaymentOptionNameEnum.Wallet,
  });

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
                getPaymentType.key,
                getDashboard.key,
                getAllTransactions.key,
              ])
              .then(async () => {
                await refetchNotifications();
                dispatch(setValues({ ...details, successResponse: res }));
                setPage(page + 1);
              });
          },
          onError: () => {
            refetchNotifications();
            setPage(page + 2);
          },
        }
      );
    },
    [
      details,
      dispatch,
      mutate,
      page,
      queryClient,
      refetchNotifications,
      setPage,
      setValues,
      total,
    ]
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
            refetchProfile();
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
    refetchProfile,
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

  useEffect(() => {
    return () => {
      refetchProfile();
    };
  }, [refetchProfile]);

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
        {selectedPaymentMethod?.name === PaymentOptionNameEnum.Card && (
          <div className="summary-field">
            <span>Pay stack fees</span>
            <Typography
              variant="subtitle"
              textColor="blue"
              content={currencyFormat(details.fees)}
            />
          </div>
        )}
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
            content={
              selectedPaymentMethod?.name === PaymentOptionNameEnum.Wallet
                ? `${currencyFormat(total - details.fees)}`
                : `${currencyFormat(total)}`
            }
          />
        </div>
      </div>
      {selectedPaymentMethod?.name === PaymentOptionNameEnum.Wallet ? (
        <Button
          text={`Pay ${currencyFormat(total - details.fees)}`}
          onClick={walletPayment}
          disabled={!total}
        />
      ) : (
        <CustomPayStackButton
          {...payStackBtn}
          metadata={{
            user_id: profile?.user_id,
            custom_fields: [
              {
                display_name: "User",
                variable_name: "user_id",
                value: profile?.user_id,
              },
            ],
          }}
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
