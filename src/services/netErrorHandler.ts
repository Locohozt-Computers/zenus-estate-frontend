import { AxiosError } from "axios";

export const netErrorHandler = (err: AxiosError): string => {
  return (
    (err?.response?.data as any)?.message ||
    (err?.response as any)?.message ||
    err?.message ||
    "Something went wrong..."
  );
};
