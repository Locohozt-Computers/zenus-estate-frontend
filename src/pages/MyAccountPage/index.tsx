import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllBanks, getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { Button, Card } from "components/atoms";
import { Typography } from "components";
import { DashboardContent } from "layouts";
import { GoBack } from "pages/ReportEmergencyPage/style";
import {
  formatNameToDisplay,
  formatPhoneNumber,
  getBankDetails,
  getInitials,
} from "utils/helpers";
import { AppIcon, pxToEm } from "utils";
import { MdModeEdit } from "react-icons/md";
import { getBankAccounts } from "pages/WalletPage/request";
import house from "assets/images/img.png";
import { ChangePasswordForm } from "pages/MyAccountPage/ChangePasswordForm";
import { FormikProvider, useFormik } from "formik";
import { notification } from "services";
import { ROUTES, VALIDATIONS } from "app-constants";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { CgClose } from "react-icons/cg";
import {
  AccountInnerInputStyling,
  DataFieldStyling,
  FormFields,
  MyAccountHeader,
  MyAccountStyle,
} from "./style";
import { changePassword, updatePhoneNumber } from "./requests";

const DataField = ({
  isOpen,
  label,
  value,
  onEditClick,
}: {
  isOpen?: boolean;
  label: string;
  value: any;
  onEditClick?: () => void;
}) => {
  return (
    <DataFieldStyling>
      <Typography variant="subtitle" textColor="blue">
        {label}
      </Typography>
      <div className="value-container">
        {typeof value !== "string" ? (
          <>{value}</>
        ) : (
          <Typography textColor="gray" content={value} />
        )}
        {onEditClick && (
          <button
            className={clsx("edit-btn", { isOpen })}
            type="button"
            onClick={onEditClick}
          >
            <AppIcon
              render={isOpen ? CgClose : MdModeEdit}
              textColor={isOpen ? "pink" : "black"}
            />
          </button>
        )}
      </div>
    </DataFieldStyling>
  );
};

const validationSchema = yup.object({
  old_password: VALIDATIONS.passwordNotRequired,
  new_password: VALIDATIONS.passwordNotRequired,
  phone_number: VALIDATIONS.phoneNumber,
});

const MyAccountPage = () => {
  const navigate = useNavigate();

  const [changePass, setChangePassword] = useState(false);
  const [changePhone, setChangePhone] = useState(false);

  const {
    isLoading,
    data,
    refetch: refetchProfile,
  } = useQuery(["getUserProfile"], getUserProfile);
  const name = (data?.tenant_name || data?.landlord_name) as string;

  const { data: bankAccounts } = useQuery(
    [getBankAccounts.key],
    getBankAccounts
  );

  const { data: banks, isLoading: bankLoading } = useQuery(
    [getAllBanks.key],
    getAllBanks
  );

  const bankDetails = useMemo(
    () => getBankDetails(banks?.data, bankAccounts),
    [bankAccounts, banks]
  );

  const { mutate, isLoading: passwordLoading } = useMutation(changePassword);
  const { mutate: mutatePhone, isLoading: phoneLoading } =
    useMutation(updatePhoneNumber);

  const formik = useFormik({
    initialValues: { old_password: "", new_password: "", phone_number: "" },
    validationSchema,
    onSubmit: (values) => {
      const onSuccess = (e: Record<string, string>) => {
        setChangePassword(false);
        notification.success(e?.message);
      };
      // if password has values in it --- then make api call
      if (values.old_password && values.new_password) {
        mutate(values, { onSuccess });
      }
      if (values.phone_number) {
        mutatePhone(
          { phone_no: values.phone_number.replace(/\D/gi, "") },
          {
            onSuccess: (e) => {
              refetchProfile();
              onSuccess(e as Record<string, string>);
            },
          }
        );
      }
    },
  });

  const handleChangePhone = () => {
    if (changePass) {
      formik.setValues({
        ...formik.values,
        phone_number: "",
      });
    }
    setChangePhone(!changePhone);
  };

  const handleChangePass = () => {
    if (changePass) {
      formik.setValues({
        ...formik.values,
        old_password: "",
        new_password: "",
      });
    }
    setChangePassword(!changePass);
  };

  return (
    <DashboardContent>
      <FormikProvider value={formik}>
        <MyAccountStyle>
          <Loader open={isLoading || bankLoading} absolute />
          <Card className="my-account-card">
            <GoBack aria-label="go back to start">
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
                {getInitials(formatNameToDisplay(name))}
              </Typography>
            </MyAccountHeader>
            <FormFields>
              <DataField label="Name" value={data?.tenant_name} />
              <DataField label="Address" value={data?.address} />
              <DataField label="Email" value={data?.tenant_email} />
              <DataField
                label="Account Details"
                value={`${bankDetails?.acc_number || "--"}--${
                  bankDetails?.bank || "--"
                }`}
                onEditClick={() =>
                  navigate({
                    pathname: ROUTES.myWallet.fullPath,
                    search: "page=Add New Account",
                  })
                }
              />
              <DataField
                isOpen={changePhone}
                label="Phone Number"
                value={
                  changePhone ? (
                    <>
                      <AccountInnerInputStyling
                        style={{ width: "85%" }}
                        type="text"
                        name="phone_number"
                        value={formik.values.phone_number}
                        onChange={(e) =>
                          formik.handleChange(formatPhoneNumber(e))
                        }
                      />
                    </>
                  ) : (
                    data?.tenant_phone
                  )
                }
                onEditClick={handleChangePhone}
              />
              <DataField
                isOpen={changePass}
                label="Password"
                value={
                  changePass ? (
                    <ChangePasswordForm formik={formik} />
                  ) : (
                    "***********"
                  )
                }
                onEditClick={handleChangePass}
              />
            </FormFields>
            <FormFields
              style={{ marginTop: pxToEm(50), marginBottom: pxToEm(50) }}
              as="fieldset"
            >
              <legend>
                <Typography weight={600} size={20} textColor="blue">
                  LandLord&apos;s Details{" "}
                </Typography>
              </legend>
              <DataField label="Name" value={data?.landlord_name} />
              <DataField label="Phone Number" value={data?.landlord_phone} />
              <DataField label="Email Address" value={data?.landlord_email} />
            </FormFields>
            <div className="center-contents">
              <Button
                loading={passwordLoading || phoneLoading}
                onClick={() => formik.handleSubmit()}
                text="Save"
                disabled={!changePass && !changePhone}
              />
            </div>
          </Card>
        </MyAccountStyle>
      </FormikProvider>
    </DashboardContent>
  );
};

export default MyAccountPage;
