import React from "react";
import { Button, FormikInput, Typography } from "components";
import { useMutation } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { Form } from "pages/SignUpPage/SignUpForm/createAccount";
import { verifyOtp, verifyPhone } from "pages/SignUpPage/request";

const validationSchema = yup.object({
  otp: yup
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .required("OTP is required"),
});

type CompleteAccountT = {
  onUpdate?: (pos: number) => void;
  onBack?: () => void;
  phoneNumber?: string;
};

const CompleteAccount: React.FC<CompleteAccountT> = ({
  onUpdate,
  onBack,
  phoneNumber,
}) => {
  const { isLoading, mutate } = useMutation(verifyOtp);
  const { isLoading: isResending, mutate: resend } = useMutation(verifyPhone);

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(
        { phone_number: phoneNumber || "", otp: values.otp },
        {
          onSuccess: () => {
            if (onUpdate) onUpdate(1);
          },
        }
      );
    },
  });

  const handleResend = () => {
    resend({ phone_number: phoneNumber || "" });
  };

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Verify your phone number
        </Typography.Heading>
        <Typography.Heading variant="bodyBig">
          Enter the 4-digit OTP sent to {phoneNumber}
        </Typography.Heading>
        <Form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormikInput
            name="otp"
            label="Enter OTP"
            placeholder="0000"
            maxLength={4}
          />
          <div className="center-contents">
            <Button type="submit" text="Verify OTP" loading={isLoading} />
          </div>
        </Form>
        <div style={{ marginTop: 16, display: "flex", gap: 24 }}>
          <Typography>
            <span
              role="button"
              tabIndex={0}
              onClick={handleResend}
              onKeyDown={(e) => e.key === "Enter" && handleResend()}
              style={{
                color: "var(--blue)",
                cursor: isResending ? "not-allowed" : "pointer",
                opacity: isResending ? 0.6 : 1,
              }}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </span>
          </Typography>
          <Typography>
            <span
              role="button"
              tabIndex={0}
              onClick={onBack}
              onKeyDown={(e) => e.key === "Enter" && onBack?.()}
              style={{ color: "var(--blue)", cursor: "pointer" }}
            >
              Change phone number
            </span>
          </Typography>
        </div>
      </div>
    </FormikProvider>
  );
};

export default CompleteAccount;
