import React, { useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuthStore } from "./useAuthStore";

/**
 * AuthProvider listens to supabase auth state changes and hydrates Zustand store.
 * Ensures secure, best-practice handling of client auth.
 */

export function AuthProvider({ children }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          // fetch profile if exists
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!error && profile) setProfile(profile);
        }
      } catch (err) {
        console.error("AuthProvider init error", err);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // best-effort profile fetch
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data);
          })
          .catch((err) => {
            console.error("Profile fetch failed", err);
          });
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [setUser, setProfile]);

  return <>{children}</>;
}
