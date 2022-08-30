import { InputHTMLAttributes } from "react";

interface BaseProps {
  name: string;
  loading?: { loader: any; state: boolean } | boolean;
  label?: string;
  error?: any;
  suffix?: any;
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseProps;

type SelectT = InputHTMLAttributes<HTMLSelectElement> & BaseProps;

export interface SelectProps extends SelectT {
  options: Array<string> | Array<{ label: string; value: string }>;
}
