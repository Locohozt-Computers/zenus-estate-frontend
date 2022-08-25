import React, { InputHTMLAttributes } from "react";
import { InputWrapper } from "./style";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  loading?: { loader: any; state: boolean } | boolean;
}

export const Input = ({ ...rest }: InputProps) => {
  return (
    <InputWrapper>
      <input {...rest} />;
    </InputWrapper>
  );
};
