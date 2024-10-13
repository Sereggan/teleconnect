import axios from "axios";

const baseURL: string = "http://localhost:8080";
const authEndpoint: string = "/auth";

const aithClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signInUser = async (
  credentials: { username: string; password: string },
  abortController: AbortController
): Promise<{
  token: string;
  refreshToken: string;
  userId: string;
  role: string;
}> => {
  const response = await aithClient.post(
    `${authEndpoint}/signin`,
    credentials,
    {
      signal: abortController.signal,
    }
  );
  return response.data;
};

export const logoutUser = async (
  tokenDetails: { token: string; refreshToken: string },
  abortController: AbortController
): Promise<void> => {
  await aithClient.post(`${authEndpoint}/logout`, tokenDetails, {
    signal: abortController.signal,
  });
};

export const resetPassword = async (
  token: string,
  newPassword: string,
  abortController: AbortController
): Promise<void> => {
  await aithClient.post(`${authEndpoint}/resetPassword`, null, {
    params: { token, newPassword },
    signal: abortController.signal,
  });
};

export const sendResetPasswordMail = async (
  email: string,
  abortController: AbortController
): Promise<void> => {
  await aithClient.get(`${authEndpoint}/sendResetPasswordMail`, {
    params: { email },
    signal: abortController.signal,
  });
};

export const validateResetPasswordCode = async (
  email: string,
  code: string,
  abortController: AbortController
): Promise<{ resetToken: string } | undefined> => {
  const response = await aithClient.get(
    `${authEndpoint}/validateResetPasswordCode`,
    {
      params: { email, code },
      signal: abortController.signal,
    }
  );
  return response.data;
};
