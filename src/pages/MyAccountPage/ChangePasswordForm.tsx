import React from "react";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { FormikValues } from "formik";
import { AccountInnerInputStyling } from "./style";

const Styling = styled.div`
  display: grid;
  width: 85%;
  grid-template-columns: 1fr;
  gap: 20px;

  @media screen and (min-width: ${pxToEm(900)}) {
    width: 90%;
    grid-template-columns: 1fr 1fr;

    > input {
      border: none;
    }
  }
`;

export const ChangePasswordForm = ({ formik }: { formik: FormikValues }) => {
  return (
    <>
      <Styling>
        <AccountInnerInputStyling
          name="old_password"
          type="password"
          placeholder="Old Password"
          onChange={formik.handleChange}
        />
        <AccountInnerInputStyling
          name="new_password"
          type="password"
          placeholder="New Password"
          onChange={formik.handleChange}
        />
      </Styling>
      <small>
        {formik.errors.old_password &&
          formik.touched.old_password &&
          formik.errors.old_password}
      </small>
      <small>
        {formik.errors.new_password &&
          formik.touched.new_password &&
          formik.errors.new_password}
      </small>
    </>
  );
};
