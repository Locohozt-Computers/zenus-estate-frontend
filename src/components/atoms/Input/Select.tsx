import React from "react";
import { SelectProps } from "components/atoms/Input/types";
import { useFormikContext } from "formik";
import { InputWrapper } from "components/atoms/Input/style";

export const Select = ({
  className,
  name,
  id,
  label,
  error,
  options,
  ...rest
}: SelectProps) => {
  return (
    <InputWrapper>
      <label htmlFor={name || id}>
        {label && <span className="input-label">{label}</span>}
        <select
          id={name || id}
          name={name}
          className={`input-input ${className ?? ""}`.trim()}
          {...rest}
        >
          {options &&
            options.map((option, i) =>
              typeof option === "string" ? (
                <option key={`${option}-${i.toString()}`} value={option}>
                  {option}
                </option>
              ) : (
                <option
                  key={`${option.label}-${i.toString()}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
        </select>
      </label>
      {error && typeof error === "string" ? (
        <small className="input-error">{error}</small>
      ) : (
        error
      )}
    </InputWrapper>
  );
};

export const FormikSelect = ({ name, label, ...rest }: SelectProps) => {
  const formik = useFormikContext();
  const { value, touched, error } = formik.getFieldMeta(
    (name || label?.toLowerCase()) as string
  );

  const hasError = error && touched && error;

  return (
    <Select
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
