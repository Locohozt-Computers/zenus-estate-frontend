import appRequest, { PutChangePassword, PutUpdateUserPhoneNumber } from "api";

export const updatePhoneNumber = async (
  data: typeof PutUpdateUserPhoneNumber.Body
) => {
  const res = await appRequest.put(PutUpdateUserPhoneNumber.Route, data);
  return res.data;
};

export const changePassword = async (data: typeof PutChangePassword.Body) => {
  const res = await appRequest.put<typeof PutChangePassword.Res>(
    PutChangePassword.Route,
    data
  );
  return res.data;
};
