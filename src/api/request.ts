import axios from "axios";

const createClient = () => {
  const appRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30000,
  });

  const setAuthorizationHeader = (token: string) => {
    appRequest.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const getAuthorizationToken = (): string | undefined => {
    return (
      appRequest.defaults.headers.common.Authorization as string | null
    )?.replace("Bearer ", "");
  };

  const removeAuthorizationHeader = () => {
    delete appRequest.defaults.headers.common.Authorization;
  };

  const requestFulfilled = () => {};
  const requestRejected = () => {};
  appRequest.interceptors.request.use(requestFulfilled, requestRejected);

  const responseFulfilled = () => {};
  const responseRejected = () => {};
  appRequest.interceptors.response.use(responseFulfilled, responseRejected);

  return {
    appRequest,
    setAuthorizationHeader,
    removeAuthorizationHeader,
    getAuthorizationToken,
  };
};

export const {
  appRequest,
  removeAuthorizationHeader,
  setAuthorizationHeader,
  getAuthorizationToken,
} = createClient();
