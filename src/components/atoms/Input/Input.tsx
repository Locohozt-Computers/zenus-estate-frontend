import React, { useState } from "react";
import { useFormikContext } from "formik";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AppIcon } from "utils";
import { InputWrapper } from "./style";
import { InputProps } from "./types";

export const Input = ({
  className,
  name,
  id,
  label,
  error,
  suffix,
  type,
  loading,
  ...rest
}: InputProps) => {
  const [show, setShow] = useState(false);
  const toggleShowPassword = () => {
    setShow(!show);
  };

  return (
    <InputWrapper suffix={suffix} loading={loading}>
      <label htmlFor={name || id}>
        {label && <span className="input-label">{label}</span>}
        <div className="input-container">
          <input
            id={name || id}
            name={name}
            className={`input-input ${className ?? ""}`.trim()}
            {...rest}
            type={
              // eslint-disable-next-line no-nested-ternary
              type === "password" ? (show ? "text" : "password") : type
            }
          />
          {type === "password" ? (
            <button
              type="button"
              aria-label={`${show ? "hide" : "show"} password`}
              className="input-suffix"
              onClick={toggleShowPassword}
            >
              {show ? (
                <AppIcon render={AiFillEye} />
              ) : (
                <AppIcon render={AiFillEyeInvisible} />
              )}
            </button>
          ) : (
            suffix && <span className="input-suffix">{suffix}</span>
          )}
        </div>
      </label>
      {error && typeof error === "string" ? (
        <small className="input-error">{error}</small>
      ) : (
        error
      )}
    </InputWrapper>
  );
};

export const FormikInput = ({
  name,
  label,
  numbersOnly,
  ...rest
}: InputProps & { numbersOnly?: boolean }) => {
  const formik = useFormikContext();
  const { value, touched, error } = formik.getFieldMeta(
    (name || label?.toLowerCase()) as string
  );

  const hasError = error && touched && error;

  const v = numbersOnly
    ? (value as string).replaceAll(/\D/g, "").trim()
    : (value as string);

  return (
    <Input
      name={(name || label?.toLowerCase()) as string}
      label={label}
      {...rest}
      value={v}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={hasError}
    />
  );
};
