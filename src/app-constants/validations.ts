import * as yup from "yup";

export const VALIDATIONS = {
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  description: yup.string(),
  address: yup.string().required("Block is required"),
  select: yup.string().required("option is required"),
};
