import * as yup from "yup";

export const VALIDATIONS = {
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  address: yup.string().required("Block is required"),
  select: yup.string().required("Block is required"),
};
