import React, { InputHTMLAttributes, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import styled from "styled-components/macro";

const InputStyling = styled.input<{ error?: boolean }>``;

const EditableInput = ({
  label,
  name,
  ...rest
}: {
  label: string;
  name: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const formik = useFormikContext();
  const { value, touched, error } = formik.getFieldMeta(
    name || label?.toLowerCase()
  );

  const hasError = error && touched && error;

  return (
    <div>
      <div>
        <InputStyling
          error={!!hasError}
          {...rest}
          value={value as string}
          type="text"
        />
        {hasError && <small>{hasError}</small>}
      </div>
      <button type="button">i</button>
    </div>
  );
};

const MyAccountPage = () => {
  const { isLoading, data } = useQuery(["getUserProfile"], getUserProfile);

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  useEffect(() => {
    if (data) {
      formik.setValues({
        estateOwner: data?.landlord_name,
        address: data?.address,
        accountNumber: data?.charge_svc,
        phoneNumber: data?.tenant_phone,
        email: data?.landlord_email,
        password: "",
      });
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <Loader open={isLoading} absolute />
      <FormikProvider value={formik}>
        <EditableInput label="Estate Owner" name="estateOwner" />
        <EditableInput label="Address" name="address" />
        <EditableInput label="Account Number" name="accountNumber" />
        <EditableInput label="Phone Number" name="phoneNumber" />
        <EditableInput label="Email" name="email" />
      </FormikProvider>
    </div>
  );
};

export default MyAccountPage;
