import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthError, Provider, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/client/supabase-client";

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;

  setSession: (session: Session) => void;
  clearSession: () => void;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;

  signInWithProvider: (provider: Provider) => Promise<void>;

  signOut: () => Promise<void>;

  setError: (error: AuthError | null) => void;
  clearError: () => void;
}
