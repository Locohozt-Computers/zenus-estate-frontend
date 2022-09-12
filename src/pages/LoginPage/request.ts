import appRequest, { PostUserLogin } from "api";

export const loginUser = async (data: typeof PostUserLogin.Body) => {
  const res = await appRequest.post<typeof PostUserLogin.Res>(
    PostUserLogin.Route,
    data
  );
  return res.data.data;
};
