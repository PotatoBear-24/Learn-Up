import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./features/auth/AuthProvider";
import { initLocalDB } from "./services/localDB";

(async () => {
  // Initialize local DB (Dexie)
  try {
    await initLocalDB();
  } catch (err) {
    console.error("Failed to initialize local DB:", err);
  }

  const root = createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
})();
