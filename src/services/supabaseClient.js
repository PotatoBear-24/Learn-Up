import { createClient } from "@supabase/supabase-js";

/**
 * Centralized Supabase client.
 * Uses VITE_ environment vars so it's safe to ship frontend anonymous key.
 * Server-side Service Role key is referenced only in migrations and server usage.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment. Copy .env.example to .env and fill values."
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // optional: redirect to / after sign in
    // redirectTo: window.location.origin
  }
});
