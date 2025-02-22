import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage/persist-storage";
import { AuthSession, AuthUser } from "@/api/auth/auth.entity";
import { AuthQueries } from "@/api/auth/auth.queries";

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

export type AuthStore = ReturnType<typeof createAuthStore>;
export { createAuthStore };

let authStore: AuthStore | null = null;

export const getAuthStore = () => {
  if (!authStore) {
    authStore = createAuthStore();
  }
  return authStore;
};

export const useAuthStoreSync = (store: AuthStore, queries: AuthQueries) => {
  queries.onAuthStateChange((payload) => {
    if (payload.session) {
      store.setState({
        session: payload.session,
        user: payload.session.user,
        isAuthenticated: true,
      });
    } else {
      store.setState(initialState);
    }
  });

  queries.getSession().then((result) => {
    if (result.isOk()) {
      store.setState({
        session: result.unwrap(),
        user: result.unwrap().user,
        isAuthenticated: true,
      });
    }
  });

  return () => {
    // Cleanup if needed
  };
};