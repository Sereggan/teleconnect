import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshTokenBasePath = "http://localhost:8080/auth/refresh-token";

const createAxiosClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
      if (error.response?.status === 403 && !originalRequest?._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const response = await axios.post(refreshTokenBasePath, {
              refreshToken,
            });
            const { token: newToken, refreshToken: newRefreshToken } =
              response.data;
            localStorage.setItem("accessToken", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export default createAxiosClient;
