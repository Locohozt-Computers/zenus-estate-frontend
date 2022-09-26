import * as yup from "yup";
import { currencyFormat } from "utils/helpers";

export const VALIDATIONS = {
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  passwordNotRequired: yup.string(),
  confirmPassword: (ref = "password") =>
    yup.string().oneOf([yup.ref(ref), null], "Passwords must match"),
  description: yup.string(),
  address: yup.string().required("Address is required"),
  accountNumber: yup.number().required("Account Number is required"),
  accountName: yup.string().required("Account Name is required"),
  bankName: yup.string().required("Bank Name is required"),
  amount: yup
    .number()
    .transform((v) => +v)
    .min(10, `Minimum amount is ${currencyFormat(10)}`)
    .nullable()
    .required("Amount is required"),
  complaintCategory: yup
    .string()
    .required("Complaint Category is required")
    .nullable(),
  paymentType: yup.string().required("Payment Type is required").nullable(),
  paymentMethod: yup.string().required("Payment Method is required").nullable(),
};
