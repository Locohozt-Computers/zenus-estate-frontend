import React from "react";
import { SelectProps } from "components/atoms/Input/types";
import { useFormikContext } from "formik";
import { InputWrapper } from "components/atoms/Input/style";
import { IconSpinner } from "assets/icons";

export const Select = ({
  className,
  name,
  id,
  label,
  error,
  placeholder,
  options,
  loading,
  ...rest
}: SelectProps) => {
  return (
    <InputWrapper loading={loading}>
      <label htmlFor={name || id}>
        {label && <span className="input-label">{label}</span>}
        <div className="input-container">
          <select
            id={name || id}
            name={name}
            className={`input-input ${className ?? ""}`.trim()}
            {...rest}
            placeholder={placeholder}
          >
            <option value="" style={{ pointerEvents: "none" }}>
              {loading ? "Loading..." : placeholder ?? "Select..."}
            </option>
            {options &&
              options.map((option, i) =>
                typeof option === "string" ? (
                  <option
                    key={`${option}-${i.toString()}`}
                    data-pos={i}
                    value={option}
                  >
                    {option}
                  </option>
                ) : (
                  <option
                    data-pos={i}
                    key={`${option.label}-${i.toString()}`}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
          </select>
          <div className="input-suffix">
            {loading && (
              <IconSpinner
                style={{
                  fontSize: 45,
                }}
              />
            )}
          </div>
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
