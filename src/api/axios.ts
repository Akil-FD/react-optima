import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env";

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const selectToken = (state: any): string | undefined => state?.auth?.token;

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const { store } = await import("../store/store");
        const token = selectToken(store.getState());

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;

          if (!config.baseURL?.includes('/auth/')) {
            config.baseURL = ENV.AUTHENTICATED_API_BASE_URL;
          }
        } else {
          config.baseURL = ENV.API_BASE_URL;
        }
      } catch (error) {
        console.error(error);
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const { store } = await import("../store/store");
          const { logout } = await import("../store/auth/auth.slice");
          store.dispatch(logout());
        } catch {
          window.location.href = "/login?unauthorized=true";
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const api = createApi();
