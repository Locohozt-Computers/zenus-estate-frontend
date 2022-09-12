import React from "react";
import { Button, FormikInput, Typography } from "components/atoms";
import { useMutation } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { ROUTES, VALIDATIONS } from "app-constants";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { Link } from "react-router-dom";
import { notification } from "services";
import { forgetPassword } from "./request";

const validationSchema = yup.object({
  email: VALIDATIONS.email,
});

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${pxToEm(50)} 0;
  gap: 50px;
`;

const ForgetPasswordPage = () => {
  const { isLoading, mutate } = useMutation(forgetPassword);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          notification.success(response.message);
        },
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Forget ZENUS account Password
        </Typography.Heading>
        <Typography.Heading variant="bodyBig">
          Estate management made easy
        </Typography.Heading>
        <Form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormikInput
            placeholder="hello@zenux.com"
            label="Email Address"
            name="email"
          />
          <div className="center-contents">
            <Button type="submit" text="Continue" loading={isLoading} />
          </div>
        </Form>
        <Typography>
          Have an account?{" "}
          <Link to={ROUTES.login.fullPath} style={{ color: "var(--blue)" }}>
            Login
          </Link>
        </Typography>
      </div>
    </FormikProvider>
  );
};

export default ForgetPasswordPage;
