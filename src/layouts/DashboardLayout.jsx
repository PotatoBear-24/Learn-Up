import React from "react";
import { Link } from "react-router-dom";
import FloatingUploadButton from "../features/upload/FloatingUploadButton";
import { useAuthStore } from "../features/auth/useAuthStore";

/**
 * Minimalistic top nav + slot children.
 * We include the floating upload button and keep existing Pomodoro UI untouched.
 */

export default function DashboardLayout({ children }) {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Learn Up</h1>
          <nav className="flex gap-3">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">Home</Link>
            <Link to="/explore" className="text-sm text-slate-600 hover:text-slate-900">Explore</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700">{user.email}</span>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch (err) {
                    console.error("Sign out failed", err);
                  }
                }}
                className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/signin" className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">Sign in</Link>
          )}
        </div>
      </header>

      <main>{children}</main>

      <FloatingUploadButton />
    </div>
  );
}
