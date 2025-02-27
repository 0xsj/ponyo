// store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage/persist-storage";
import { AuthSession, AuthUser } from "@/api/auth/auth.types";

interface AuthState {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (session: AuthSession | null) => void;
  setUser: (user: AuthUser | null) =>  void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: false,
  isAuthenticated: false
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        });
      },
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);