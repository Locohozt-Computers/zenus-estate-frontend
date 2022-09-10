import React from "react";
import { Button, FormikInput, Typography } from "components/atoms";
import { useMutation } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { ROUTES, VALIDATIONS } from "app-constants";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "services";
import { resetPassword } from "./request";

const validationSchema = yup.object({
  email: VALIDATIONS.email,
  password: VALIDATIONS.password,
  password_confirmation: VALIDATIONS.password
    .required("Confirm Password required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${pxToEm(50)} 0;
  gap: 50px;
`;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { isLoading, mutate } = useMutation(resetPassword);

  const formik = useFormik({
    initialValues: {
      email: "",
      token: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          notification.success(response.message);
          notification.info("You will be redirected shortly");
          setTimeout(() => {
            navigate(ROUTES.login.fullPath);
          }, 3000);
        },
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Reset ZENUS account Password
        </Typography.Heading>
        <Typography.Heading variant="bodyBig">
          Estate management made easy
        </Typography.Heading>
        <Form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormikInput placeholder="" label="Email Address" name="email" />
          <FormikInput type="password" name="password" label="Password" />
          <FormikInput
            type="password"
            name="password_confirmation"
            label="Confirm Password"
          />
          <div className="center-contents">
            <Button type="submit" text="Reset" loading={isLoading} />
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

export default ResetPasswordPage;
