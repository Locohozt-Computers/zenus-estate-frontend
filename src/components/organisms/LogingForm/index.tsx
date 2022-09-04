import React from "react";
import { Button, FormikInput, Typography } from "components/atoms";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "components/organisms/LogingForm/request";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { ROUTES, VALIDATIONS } from "app-constants";
import { authActions } from "store/reducers/auth/authDocSlice";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { Link } from "react-router-dom";

const validationSchema = yup.object({
  email: VALIDATIONS.email,
  password: VALIDATIONS.password,
});

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${pxToEm(50)} 0;
  gap: 50px;
`;

const ForgetPassword = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

export const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading, mutate } = useMutation(loginUser);

  const { authUser } = authActions;

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          dispatch(authUser(response));
        },
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Login my ZENUS account
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
          <div>
            <FormikInput type="password" name="password" label="Password" />
            <ForgetPassword>
              <Typography textColor="blue">
                <Link to={ROUTES.other.fullPath}>Forget Password?</Link>
              </Typography>
            </ForgetPassword>
          </div>
          <div className="center-contents">
            <Button type="submit" text="login" loading={isLoading} />
          </div>
        </Form>
        <Typography>
          Dont have an account?{" "}
          <Link to={ROUTES.other.fullPath} style={{ color: "var(--blue)" }}>
            Sign up here
          </Link>
        </Typography>
      </div>
    </FormikProvider>
  );
};
