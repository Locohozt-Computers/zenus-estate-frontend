import * as yup from "yup";

export const VALIDATIONS = {
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  description: yup.string(),
  address: yup.string().required("Address is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .transform((v) => +v)
    .min(50)
    .nullable(),
  complaintCategory: yup
    .string()
    .required("Complaint Category is required")
    .nullable(),
  paymentType: yup.string().required("Payment Type is required").nullable(),
  paymentMethod: yup.string().required("Payment Method is required").nullable(),
};
