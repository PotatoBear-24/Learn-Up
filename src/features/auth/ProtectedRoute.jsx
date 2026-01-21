import React from "react";
import { useAuthStore } from "./useAuthStore";
import { Navigate } from "react-router-dom";

/**
 * Protects routes from unauthenticated access.
 */

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
