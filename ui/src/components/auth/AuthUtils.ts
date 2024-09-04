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
