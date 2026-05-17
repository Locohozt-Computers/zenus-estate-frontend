import React from "react";
import { Button, FormikInput, Typography } from "components";
import { useMutation } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { ROUTES } from "app-constants";
import { verifyPhone } from "pages/SignUpPage/request";

export const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${pxToEm(50)} 0;
  gap: 50px;
`;

const validationSchema = yup.object({
  phone_number: yup
    .string()
    .min(10, "Invalid phone number")
    .required("Phone number is required"),
});

type CreateAccountT = {
  onUpdate?: (pos: number) => void;
  onPhoneVerified?: (phone: string) => void;
};

const CreateAccount: React.FC<CreateAccountT> = ({
  onUpdate,
  onPhoneVerified,
}) => {
  const { isLoading, mutate } = useMutation(verifyPhone);

  const formik = useFormik({
    initialValues: { phone_number: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
          if (onPhoneVerified) onPhoneVerified(values.phone_number);
          if (onUpdate) onUpdate(1);
        },
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Create a ZENUS account
        </Typography.Heading>
        <Typography.Heading variant="bodyBig">
          Estate management made easy
        </Typography.Heading>
        <Form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormikInput
            name="phone_number"
            label="Enter phone number"
            placeholder="+2348012345678"
          />
          <div className="center-contents">
            <Button type="submit" text="Continue" loading={isLoading} />
          </div>
        </Form>
        <Typography>
          Already have an account?{" "}
          <Link to={ROUTES.login.fullPath} style={{ color: "var(--blue)" }}>
            Login here
          </Link>
        </Typography>
      </div>
    </FormikProvider>
  );
};

export default CreateAccount;
