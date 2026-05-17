import appRequest from "api";
import {
  PostSignupVerifyPhone,
  PostSignupVerifyOtp,
  PostSignupRegister,
} from "api/types";

export const verifyPhone = async (data: typeof PostSignupVerifyPhone.Body) => {
  const res = await appRequest.post<typeof PostSignupVerifyPhone.Res>(
    PostSignupVerifyPhone.Route,
    data
  );
  return res.data;
};

export const verifyOtp = async (data: typeof PostSignupVerifyOtp.Body) => {
  const res = await appRequest.post<typeof PostSignupVerifyOtp.Res>(
    PostSignupVerifyOtp.Route,
    data
  );
  return res.data;
};

export const registerUser = async (data: typeof PostSignupRegister.Body) => {
  const res = await appRequest.post<typeof PostSignupRegister.Res>(
    PostSignupRegister.Route,
    data
  );
  return res.data.data;
};
