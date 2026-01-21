import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Explore from "./features/explore/Explore";
import { SignIn } from "./features/auth/SignIn";
import { useAuthStore } from "./features/auth/useAuthStore";
import ProtectedRoute from "./features/auth/ProtectedRoute";

/**
 * Keep existing Pomodoro and minimal UI intact.
 * We add Explore, SignIn, and Upload integration via layout.
 */

export default function App() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <DashboardLayout>
              <Explore />
            </DashboardLayout>
          }
        />
        <Route
          path="/signin"
          element={
            <DashboardLayout>
              <SignIn />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>
                  <h2 className="text-xl font-semibold">Profile</h2>
                  <p className="mt-2">Signed in as {user?.email ?? "Unknown"}</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <DashboardLayout>
              <div>
                <h2>404 — Not found</h2>
                <Link to="/" className="text-blue-600">Go home</Link>
              </div>
            </DashboardLayout>
          }
        />
      </Routes>
    </div>
  );
}
