import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ROUTES } from "app-constants";
import store from "store";
import { authActions } from "store/reducers/auth/authDocSlice";
import { netErrorHandler, notification } from "services";

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

  const onRequestOut = (config: AxiosRequestConfig) => {
    return config;
  };
  const onRequestRejected = (error: AxiosError) => {
    return Promise.reject(error);
  };
  appRequest.interceptors.request.use(onRequestOut, onRequestRejected);

  const responseFulfilled = (response: AxiosResponse) => {
    return response;
  };
  const responseRejected = (error: AxiosError) => {
    notification.error(netErrorHandler(error));

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const newUrl = `/${ROUTES.login.path}?redirect=${currentPath}`;
      setTimeout(() => {
        window.location.replace(window.location.origin + newUrl);
      });
      store.dispatch(authActions.logoutUser());
    }
    return Promise.reject(error);
  };
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
