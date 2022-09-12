import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  name: string;
  loading?: boolean;
  label?: string;
  error?: any;
  suffix?: any;
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseProps;

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseProps;

type SelectT = InputHTMLAttributes<HTMLSelectElement> & BaseProps;

export interface SelectProps extends SelectT {
  options: Array<string> | Array<{ label: string; value: any }>;
}
