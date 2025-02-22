// store/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage/persist-storage";
import { AuthSession, AuthUser } from "@/api/auth/domain/auth.entity";

interface AuthState {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setSession: (session: AuthSession | null) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const createAuthStore = () =>
  create<AuthState & AuthActions>()(
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
        name: "auth-storage",
        storage: createJSONStorage(() => zustandStorage),
        partialize: (state) => ({
          session: state.session,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  );

let authStore: ReturnType<typeof createAuthStore> | null = null;

export const getAuthStore = () => {
  if (!authStore) {
    authStore = createAuthStore();
  }
  return authStore;
};

export type AuthStore = ReturnType<typeof createAuthStore>;
