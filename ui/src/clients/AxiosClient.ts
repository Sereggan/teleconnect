import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const refreshTokenBasePath = "http://localhost:8080/auth/refresh-token";

const token = localStorage.getItem("accessToken");

const createAxiosClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest?._retry) {
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
            window.location.href = "/";
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export default createAxiosClient;
