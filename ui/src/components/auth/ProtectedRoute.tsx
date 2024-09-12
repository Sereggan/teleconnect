import React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../../models/User";
import { getUserRoleFromToken } from "./AuthUtils";

export default function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: React.ReactNode;
  requiredRoles: UserRole[];
}) {
  const token = localStorage.getItem("accessToken");
  const userRole = getUserRoleFromToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!userRole || !requiredRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
