import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

/**
 * SignIn UI allowing OAuth providers and email/password.
 * Uses Zustand actions to perform authentication.
 */

export function SignIn() {
  const signInWithProvider = useAuthStore((s) => s.signInWithProvider);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleProvider = async (provider) => {
    setErrorMsg("");
    const res = await signInWithProvider(provider);
    if (!res.ok) {
      setErrorMsg(res.error || "Failed to start provider sign-in.");
    } else {
      // Providers redirect externally; if same-window OAuth configured,
      // Supabase will redirect back to app and AuthProvider will handle session.
    }
  };

  const handleEmailSignUp = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }
    const res = await signUpWithEmail(email, password);
    if (!res.ok) setErrorMsg(res.error || "Sign up failed.");
    else navigate("/");
  };

  const handleEmailSignIn = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }
    const res = await signInWithEmail(email, password);
    if (!res.ok) setErrorMsg(res.error || "Sign in failed.");
    else navigate("/");
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow-sm">
      <h3 className="text-lg font-medium mb-3">Sign in</h3>

      {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleProvider("google")}
          disabled={loading}
          className="flex-1 px-3 py-2 bg-gray-50 rounded"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleProvider("github")}
          disabled={loading}
          className="flex-1 px-3 py-2 bg-gray-50 rounded"
        >
          GitHub
        </button>
        <button
          onClick={() => handleProvider("discord")}
          disabled={loading}
          className="flex-1 px-3 py-2 bg-gray-50 rounded"
        >
          Discord
        </button>
      </div>

      <div className="mb-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-3">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEmailSignIn}
          disabled={loading}
          className="px-3 py-2 bg-blue-50 text-blue-700 rounded"
        >
          Sign in
        </button>
        <button
          onClick={handleEmailSignUp}
          disabled={loading}
          className="px-3 py-2 bg-green-50 text-green-700 rounded"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
