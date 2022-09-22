import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { FormikProvider, useFormik } from "formik";
import styled from "styled-components/macro";
import { Input, Card, Button } from "components/atoms";
import { Typography } from "components";
import { DashboardContent } from "layouts";
import { GoBack } from "pages/ReportEmergencyPage/style";
import { AppIcon } from "utils";
import { IconArrowLeft } from "assets/icons";
import { formatNameToDisplay, getInitials } from "utils/helpers";
import house from "../assets/images/img.png";

const MyAccountStyle = styled.div`
  position: relative;
  .editableInput {
    border-radius: 0 !important;
    border-bottom: 1px solid #ededed !important;
    background: none !important;
    padding: 0.5rem 0 !important;
    outline: none;
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
  label {
    > span {
      color: var(--blue) !important;
    }
  }
  .my-account-card {
    width: 100%;
    max-width: 697px;
    margin: auto;
    padding: 59px 42px;
  }
  .initials {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: var(--blue);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2.3px solid white;
    position: relative;
    top: 132px;
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
  const name = (data?.tenant_name || data?.landlord_name) as string;
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
          <GoBack aria-label="go back to start">
            <AppIcon size={40} render={IconArrowLeft} />
            <Typography
              variant="bodyBig"
              textColor="gray"
              style={{ marginLeft: 5 }}
            >
              My Account
            </Typography>
          </GoBack>
          <MyAccountHeader style={{ backgroundImage: `url(${house})` }}>
            <Typography className="initials" size={34} textColor="white">
              {getInitials(name)}
            </Typography>
          </MyAccountHeader>
          <div>
            <Input
              readOnly
              label="Name"
              name="amount"
              className="editableInput"
              value={data?.tenant_name}
            />
            <Input
              readOnly
              label="Address"
              name="address"
              className="editableInput"
              value={data?.address}
            />{" "}
            <Input
              readOnly
              label="Email"
              name="amount"
              className="editableInput"
              placeholder="danielmbazu9@gmail.com"
              type="email"
              value={data?.tenant_email}
            />{" "}
          </div>
          <FormikProvider value={formik}>
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
                value={data?.landlord_name}
              />{" "}
              <Input
                readOnly
                label="Phone Number"
                name="phoneNumber"
                className="editableInput"
                value={data?.landlord_phone}
              />{" "}
              <Input
                readOnly
                label="Email Adress"
                name="phoneNumber"
                className="editableInput"
                value={data?.landlord_email}
              />{" "}
            </fieldset>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button text="Save" />
            </div>
          </FormikProvider>
        </Card>
      </MyAccountStyle>
    </DashboardContent>
  );
};

export default MyAccountPage;
