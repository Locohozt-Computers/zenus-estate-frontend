import React, { useState } from "react";
import { Button, Card, FormikInput, Modal, Typography } from "components";
import { useMutation } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { ROUTES, VALIDATIONS } from "app-constants";
import { Form } from "pages/SignUpPage/SignUpForm/createAccount";
import { registerUser } from "pages/SignUpPage/request";

const validationSchema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: VALIDATIONS.email,
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password_confirmation: VALIDATIONS.confirmPassword("password").required(
    "Please confirm your password"
  ),
});

type RegisterAccountT = {
  phoneNumber?: string;
  status?: (verify: boolean) => void;
};

const RegisterAccount: React.FC<RegisterAccountT> = ({
  phoneNumber,
  status,
}) => {
  const [successVisible, setSuccessVisible] = useState(false);
  const { isLoading, mutate } = useMutation(registerUser);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(
        { ...values, phone_number: phoneNumber || "" },
        {
          onSuccess: () => {
            setSuccessVisible(true);
            if (status) status(true);
          },
        }
      );
    },
  });

  return (
    <FormikProvider value={formik}>
      <div style={{ width: "100%", maxWidth: 572 }}>
        <Typography.Heading variant="heading3">
          Complete your registration
        </Typography.Heading>
        <Typography.Heading variant="bodyBig">
          Just a few more details
        </Typography.Heading>
        <Form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormikInput
            name="first_name"
            label="First name"
            placeholder="John"
          />
          <FormikInput name="last_name" label="Last name" placeholder="Doe" />
          <FormikInput
            name="email"
            label="Email address"
            placeholder="hello@example.com"
          />
          <FormikInput type="password" name="password" label="Password" />
          <FormikInput
            type="password"
            name="password_confirmation"
            label="Confirm password"
          />
          <div className="center-contents">
            <Button type="submit" text="Create Account" loading={isLoading} />
          </div>
        </Form>
        <Typography>
          Already have an account?{" "}
          <Link to={ROUTES.login.fullPath} style={{ color: "var(--blue)" }}>
            Login here
          </Link>
        </Typography>
      </div>

      <Modal maxWidth={620} visible={successVisible}>
        <Card
          style={{
            padding: "50px 70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography.Heading
            size={28}
            style={{ marginBottom: 18 }}
            variant="heading3"
          >
            Account Created!
          </Typography.Heading>
          <Typography style={{ marginBottom: 18, textAlign: "center" }}>
            Your account has been created successfully. Please check your email
            to verify your account.
          </Typography>
          <div>
            <Button
              type="button"
              text="Go to Login"
              onClick={() => {
                setSuccessVisible(false);
                window.location.replace(ROUTES.login.fullPath);
              }}
              className="modal-btn"
              style={{ marginTop: 70 }}
            />
          </div>
        </Card>
      </Modal>
    </FormikProvider>
  );
};

export default RegisterAccount;
