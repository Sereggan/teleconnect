import { UserRole } from "../../models/User";

export const getUserRoleFromToken = (): UserRole | null => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.role as UserRole;
  }
  return null;
};

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.userId;
  }
  return null;
};

export const getEmailFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const payload = JSON.parse(decodedPayload);
    return payload.email;
  }
  return null;
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("accessToken") ? true : false;
};
