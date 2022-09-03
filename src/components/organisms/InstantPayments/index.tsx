import React from "react";
import styled from "styled-components";
import {
  Input,
  Button,
  FormikInput,
  FormikSelect,
  Typography,
} from "components/atoms";
import { InputWrapper } from "components/atoms/Input/style";
import { FormikProvider, useFormik } from "formik";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";

const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const validationSchema = yup.object({
  block: VALIDATIONS.address,
  paymentSelect: VALIDATIONS.password,
});

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const InstantForm = ({ page, setPage }: Props) => {
  const formik = useFormik({
    initialValues: { block: "12 Okue Street, Okota.", paymentSelect: "" },
    validationSchema,
    onSubmit: (values) => {},
  });

  return (
    <FormikProvider value={formik}>
      <StyledForm onSubmit={formik.handleSubmit} className="form-section">
        <span style={{ alignSelf: "flex-start" }}>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content=" Pay your bills in few minuites"
          />
        </span>
        <FormikInput
          color="white"
          type="text"
          label="Block Number"
          name="block"
          placeholder="12 Okue Street, Okota."
        />
        <FormikSelect
          name="paymentSelect"
          placeholder="Service Charge Fee"
          options={["2", "abc"]}
          label="Payment type"
        >
          <option value="" disabled selected hidden>
            Choose a drink
          </option>
        </FormikSelect>
        <Input
          type="number"
          label="Outstanding Payment Balance"
          name="block"
          value={200000}
          readOnly
          style={{ color: "var(--blue)", fontWeight: "500", fontSize: " 17px" }}
        />
        <Button text="Next" type="submit" onClick={() => setPage(page + 1)} />
      </StyledForm>
    </FormikProvider>
  );
};
