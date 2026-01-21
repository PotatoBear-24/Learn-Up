import create from "zustand";
import { supabase } from "../../services/supabaseClient";

/**
 * Zustand store for auth state and helper methods.
 * Keeps simple profile and user info, persists in localStorage for quick boot.
 */

const initial = {
  user: null,
  profile: null,
  loading: false
};

export const useAuthStore = create((set, get) => ({
  ...initial,
  setLoading: (loading) => set({ loading }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  signInWithProvider: async (provider) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      // Supabase redirects to external provider; session handled in onAuthStateChange
      return { ok: true };
    } catch (err) {
      console.error("Provider sign-in error", err);
      return { ok: false, error: err.message || String(err) };
    } finally {
      set({ loading: false });
    }
  },
  signUpWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      set({ user: data.user || null });
      return { ok: true, data };
    } catch (err) {
      console.error("Sign up error", err);
      return { ok: false, error: err.message || String(err) };
    } finally {
      set({ loading: false });
    }
  },
  signInWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      set({ user: data.user || null });
      return { ok: true, data };
    } catch (err) {
      console.error("Sign in error", err);
      return { ok: false, error: err.message || String(err) };
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
      return { ok: true };
    } catch (err) {
      console.error("Sign out error", err);
      return { ok: false, error: err.message || String(err) };
    } finally {
      set({ loading: false });
    }
  }
}));
