import React, { ChangeEvent, useState } from "react";
import { Input, Typography } from "components";
import { CustomPayStackButton } from "pages/InstantPayPage/PayStackButton";
import { currencyFormat } from "utils/helpers";
import { VALIDATIONS } from "app-constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { usePaystackPayment } from "react-paystack";
import * as yup from "yup";
import { ValidationError } from "yup";
import { PayStackResponseI } from "api";
import { fundWallet } from "pages/WalletPage/request";
import { getAllNotifications } from "components/organisms/NotificationDropdown/request";

const validationSchema = {
  amount: VALIDATIONS.amount,
};

export const FundWallet = ({
  onSuccess,
}: {
  onSuccess?: (r?: PayStackResponseI) => void;
}) => {
  const { data: profile, isLoading: profileLoading } = useQuery(
    [getUserProfile.key],
    getUserProfile
  );

  const { refetch: refetchNotification } = useQuery(
    [getAllNotifications.key],
    getAllNotifications
  );

  const { mutate, isLoading } = useMutation(fundWallet);

  const [amount, setAmount] = useState(0);
  const [isSuccess, setIsSuccess] = useState("");
  const [err, setErr] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (err) setErr("");
    const v = e.target.value.replace(/\D/g, "");
    setAmount(+v);
  };

  const validatePayment = async (
    payStack: ReturnType<typeof usePaystackPayment>
  ) => {
    try {
      await yup.object(validationSchema).validate({ amount });
      const successCall = (r?: PayStackResponseI) => {
        mutate(
          {
            amount: +amount,
            reference: r?.reference as string,
            trans_id: r?.trans as string,
          },
          {
            onSuccess: () => {
              setIsSuccess("Complete");
              refetchNotification();
              if (onSuccess) onSuccess(r);
            },
            onError: () => {
              refetchNotification();
              setIsSuccess("Failed");
            },
          }
        );
      };
      payStack(successCall);
    } catch (e) {
      const yErr = e as ValidationError;
      setErr(yErr?.message);
    }
  };

  return (
    <>
      <Loader absolute open={profileLoading || isLoading} />
      {isSuccess ? (
        <div style={{ padding: 80 }}>
          <Typography variant="heading4">Transaction {isSuccess}!</Typography>
        </div>
      ) : (
        <>
          <Typography
            variant="heading5"
            style={{ textAlign: "start", marginBottom: 10 }}
          >
            Fund Wallet
          </Typography>
          <Input
            value={amount}
            name="amount"
            placeholder="Enter Amount"
            onChange={handleChange}
            error={err}
          />
          <div style={{ marginTop: 30 }}>
            <CustomPayStackButton
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
              email={profile?.landlord_email}
              amount={amount * 100} // convert to kobo
              buttonProps={{
                disabled: +amount <= 0,
                text: `Pay ${currencyFormat(amount)}`,
              }}
              onClick={(r) => {
                validatePayment(r);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};
