import appRequest, {
  PostChangePin,
  PostSetPin,
  PutChangePassword,
  PutUpdateUserPhoneNumber,
} from "api";

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

export const setPin = async (data: typeof PostSetPin.Body) => {
  const res = await appRequest.post<typeof PostSetPin.Res>(
    PostSetPin.Route,
    data
  );
  return res.data;
};

export const changePin = async (data: typeof PostChangePin.Body) => {
  const res = await appRequest.post<typeof PostChangePin.Res>(
    PostChangePin.Route,
    data
  );
  return res.data;
};
