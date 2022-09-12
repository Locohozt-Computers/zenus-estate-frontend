import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { useFormikContext } from "formik";
import React from "react";
import { InputWrapper } from "components/atoms/Input/style";
import { TextAreaProps } from "components/atoms/Input/types";

export const TextAreaStyling = styled.textarea`
  width: 100%;
  font-size: ${pxToEm(16)};
  background-color: var(--light-gray);
  border: none;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  padding: ${pxToEm(33)};
  padding-bottom: 0;

  :focus {
    border: 1px solid var(--blue);
  }
`;

export const TextArea = ({ error, ...rest }: TextAreaProps) => {
  return (
    <InputWrapper>
      <TextAreaStyling {...rest} />
      {error && typeof error === "string" ? (
        <small className="input-error">{error}</small>
      ) : (
        error
      )}
    </InputWrapper>
  );
};

export const FormikTextArea = ({ name, ...rest }: TextAreaProps) => {
  const formik = useFormikContext();
  const { value, touched, error } = formik.getFieldMeta(
    name as unknown as string
  );
  const hasError = error && touched && error;

  return (
    <TextArea
      name={name}
      {...rest}
      value={value as any}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
    />
  );
};
