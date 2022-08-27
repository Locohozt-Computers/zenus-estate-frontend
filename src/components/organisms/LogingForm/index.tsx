import React from "react";
import { Button, FormikInput } from "components/atoms";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "components/organisms/LogingForm/request";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { VALIDATIONS } from "app-constants";
import { authActions } from "store/reducers/auth/authDocSlice";
import { useDispatch } from "react-redux";
import { notification } from "services";
import { AxiosError } from "axios";

const validationSchema = yup.object({
  email: VALIDATIONS.email,
  password: VALIDATIONS.password,
});

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
        onError: (err) => {
          const e = err as AxiosError;
          const mssg = (e?.response?.data as any)?.message || e?.message;
          notification.error(mssg as string);
        },
      });
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <FormikInput label="Email" name="email" />
        <FormikInput name="password" label="Password" />
        <Button type="submit" text="login" loading={isLoading} />
      </form>
    </FormikProvider>
  );
};
