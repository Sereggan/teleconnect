import React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../../models/User";
import { getUserRoleFromToken } from "./AuthUtils";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export default function RoleProtectedRoute({
  children,
  requiredRole,
}: RoleProtectedRouteProps) {
  const userRole = getUserRoleFromToken();

  if (!userRole || userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
