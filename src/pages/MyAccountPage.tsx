import React, { InputHTMLAttributes, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import styled from "styled-components/macro";
import { Input, Card } from "components/atoms";
import { Typography } from "components";
import { DashboardContent } from "layouts";
import house from "../assets/images/img.png";

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

const MyAccountStyle = styled.div`
  position: relative;
  .editableInput {
    //background: red !important;
    border-radius: 0 !important;
    border-bottom: 1px solid #ededed !important;
    background: none !important;
    padding: 0.5rem 0 !important;
  }
  .input-container {
    margin-bottom: 35px;
  }
  fieldset {
    border: none;
  }
  legend {
    margin-bottom: 37px;
  }
  .my-account-card {
    width: 100%;
    max-width: 697px;
    margin: auto;
  }
`;

const MyAccountHeader = styled.div`
  height: 192px;
  margin-bottom: 35px;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

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
    <DashboardContent>
      <MyAccountStyle>
        <Loader open={isLoading} absolute />
        <Card className="my-account-card">
          <MyAccountHeader style={{ backgroundImage: `url(${house})` }}>
            <Typography
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: "var(--blue)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2.3px solid white",
                position: "relative",
                top: "132px",
              }}
              size={34}
              textColor="white"
            >
              DM
            </Typography>
          </MyAccountHeader>
          <FormikProvider value={formik}>
            <div>
              <Input
                readOnly
                label="Estate Owner"
                name="amount"
                className="editableInput"
                placeholder="Daniel Mbazu"
              />
            </div>
            <Input
              readOnly
              label="Address"
              name="address"
              className="editableInput"
              placeholder="12 Okue Street, Okota, Mainland."
            />{" "}
            <Input
              readOnly
              label="Email"
              name="amount"
              className="editableInput"
              placeholder="danielmbazu9@gmail.com"
              type="email"
            />{" "}
            <Input
              readOnly
              label="Account Details"
              name="account"
              className="editableInput"
              placeholder="Daniel Mbazu"
            />{" "}
            <Input
              readOnly
              label="Phone Number"
              name="phoneNumber"
              className="editableInput"
              placeholder="Daniel Mbazu"
            />{" "}
            <Input
              readOnly
              label="Password"
              name="amount"
              className="editableInput"
              type="password"
            />
            <fieldset>
              <legend>
                <Typography weight={600} size={20} textColor="blue">
                  LandLord&apos;s Details{" "}
                </Typography>
              </legend>
              <Input
                readOnly
                label="Name"
                name="name"
                className="editableInput"
                placeholder="Daniel Mbazu"
              />{" "}
              <Input
                readOnly
                label="Phone Number"
                name="phoneNumber"
                className="editableInput"
                placeholder="Daniel Mbazu"
              />{" "}
              <Input
                readOnly
                label="Email Adress"
                name="phoneNumber"
                className="editableInput"
                placeholder="Daniel Mbazu"
              />{" "}
            </fieldset>
            <EditableInput label="Estate Owner" name="estateOwner" />
            <EditableInput label="Address" name="address" />
            <EditableInput label="Account Number" name="accountNumber" />
            <EditableInput label="Phone Number" name="phoneNumber" />
            <EditableInput label="Email" name="email" />
          </FormikProvider>
        </Card>
      </MyAccountStyle>
    </DashboardContent>
  );
};

export default MyAccountPage;
