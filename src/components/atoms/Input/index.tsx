import React, { InputHTMLAttributes } from "react";
import { useFormikContext } from "formik";
import { InputWrapper } from "./style";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  loading?: { loader: any; state: boolean } | boolean;
  label?: string;
  error?: any;
}

export const Input = ({
  className,
  name,
  id,
  label,
  error,
  ...rest
}: InputProps) => {
  return (
    <InputWrapper>
      <label htmlFor={name || id}>
        {label && <span className="input-label">{label}</span>}
        <input
          id={name || id}
          name={name}
          className={`input-input${className}`.trim()}
          {...rest}
        />
      </label>
      {error && typeof error === "string" ? <small>{error}</small> : error}
    </InputWrapper>
  );
};

export const FormikInput = ({ name, label, ...rest }: InputProps) => {
  const formik = useFormikContext();
  const { value, touched, error } = formik.getFieldMeta(
    (name || label?.toLowerCase()) as string
  );

  const hasError = error && touched && error;

  return (
    <Input
      name={(name || label?.toLowerCase()) as string}
      label={label}
      {...rest}
      value={value as string}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
    />
  );
};
