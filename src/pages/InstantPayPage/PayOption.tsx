import React, { useState } from "react";
import styled from "styled-components";
import { Typography, Button } from "components/atoms";
import { IconMasterCard, IconWallet } from "assets/icons";
import { useQuery } from "@tanstack/react-query";
import { getPaymentMethod, getUserProfile } from "pages/request";
import {
  paymentActions,
  paymentSelectors,
} from "store/reducers/payment/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import clsx from "clsx";
import * as yup from "yup";
import { PaymentOptionNameEnum } from "api";
import { AppIcon } from "utils";
import { VALIDATIONS } from "app-constants";
import { currencyFormat } from "utils/helpers";
import { notification } from "services";
import { PageProps } from "./Props";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .paymentMethod {
    width: 100%;
    height: 58px;
    background: var(--light-gray);
    border-radius: 7px;
    font-size: 17px;
    padding-left: 33px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 20px 0;
    color: var(--med-gray);

    &--active {
      color: var(--blue);
      background: #f5f8ff;
      border: 1px solid var(--blue);
    }

    :hover,
    :focus {
      border: 1px solid var(--blue);
    }
  }

  .balance {
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: space-between;
    color: var(--blue);
  }
`;

const validationSchema = yup.object({
  payment_method_id: VALIDATIONS.paymentMethod,
});

const getLabel = (name: PaymentOptionNameEnum) => {
  if (name === PaymentOptionNameEnum.Wallet) {
    return {
      label: "My Zenus Wallet Balance",
      icon: IconWallet,
    };
  }
  if (name === PaymentOptionNameEnum.Card) {
    return { label: "Pay with Card or Bank Transfer", icon: IconMasterCard };
  }
  return { label: "", icon: null };
};

export const PayOption = ({ page, setPage }: PageProps) => {
  const { isLoading: profileLoading, data: profileData } = useQuery(
    [getUserProfile.key],
    getUserProfile,
    { cacheTime: 0 }
  );

  const [payOption, setPayOption] = useState("");

  const dispatch = useDispatch();

  const details = useSelector(paymentSelectors.state);

  const { setValues } = paymentActions;

  const { data, isLoading } = useQuery(
    [getPaymentMethod.key],
    getPaymentMethod
  );

  const formik = useFormik({
    initialValues: { payment_method_id: null },
    validationSchema,
    onSubmit: (values) => {
      dispatch(setValues({ ...details, ...values }));
      setPage(page + 1);
    },
  });

  const handleSelect = (name: string, id: number) => () => {
    if (
      name === PaymentOptionNameEnum.Wallet &&
      (profileData?.walletBalance || 0) <= 0
    ) {
      notification.info(
        profileLoading
          ? "Please wait, retrieving wallet balance"
          : "You don't have enough wallet balance"
      );
      return null;
    }
    setPayOption(name);
    formik.setFieldValue("payment_method_id", id, true);
  };

  return (
    <StyledDiv>
      <span style={{ alignSelf: "flex-start", marginBottom: "37px" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content="Choose Your Prefered Payment Method"
        />
      </span>
      <div>
        {formik.errors.payment_method_id &&
          formik.touched.payment_method_id && (
            <small style={{ color: "var(--pink)" }}>
              {formik.errors.payment_method_id}
            </small>
          )}
      </div>
      {isLoading && (
        <div style={{ padding: "20px 0" }}>
          <Typography
            size={14}
            textColor="blue"
            content="Getting payment methods..."
          />
        </div>
      )}
      {!isLoading &&
        data &&
        data.map((el) => (
          <button
            key={el.id}
            type="button"
            className={clsx("paymentMethod", {
              "paymentMethod--active": payOption === el.name,
            })}
            onClick={handleSelect(el.name, el.id)}
          >
            <>
              {getLabel(el.name).icon && (
                <AppIcon
                  render={getLabel(el.name).icon as any}
                  color="var(--blue)"
                  style={{ marginRight: 12 }}
                />
              )}
              <Typography size={17} content={getLabel(el.name).label} />
            </>
          </button>
        ))}

      <div className="balance">
        <span>
          <IconWallet fill="var(--blue)" style={{ marginRight: 12 }} />
          Wallet Balance
        </span>
        <span>
          {profileLoading ? (
            <Typography size={14} content="Getting Balance..." />
          ) : (
            currencyFormat(profileData?.walletBalance || 0)
          )}
        </span>
      </div>
      <div className="center-contents">
        <Button
          text="Next"
          type="submit"
          onClick={() => formik.handleSubmit()}
          style={{ marginTop: 130 }}
        />
      </div>
    </StyledDiv>
  );
};
