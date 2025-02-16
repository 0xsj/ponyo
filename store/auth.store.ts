// // stores/auth.store.ts
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import type {
//   AuthSession,
//   AuthUser,
//   AuthCredentials,
//   AuthResult,
// } from "../lib/core";
// import { SupabaseAuthProvider } from "../lib/supabase/provider";
// import { zustandStorage } from "@/lib/storage/persist-storage";

// const provider = new SupabaseAuthProvider();

// type State = {
//   session: AuthSession | null;
//   isLoading: boolean;
// };

// type Actions = {
//   signIn: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
//   signUp: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
//   signOut: () => Promise<void>;
// };

// export const useAuthStore = create<State & Actions>()(
//   persist(
//     (set) => ({
//       session: null,
//       isLoading: false,

//       signIn: async (credentials) => {
//         set({ isLoading: true });
//         const result = await provider.signIn(credentials);
//         if (result.data) {
//           set({ session: result.data });
//         }
//         set({ isLoading: false });
//         return result;
//       },

//       signUp: async (credentials) => {
//         set({ isLoading: true });
//         const result = await provider.signUp(credentials);
//         if (result.data) {
//           set({ session: result.data });
//         }
//         set({ isLoading: false });
//         return result;
//       },

//       signOut: async () => {
//         set({ isLoading: true });
//         await provider.signOut();
//         set({ session: null, isLoading: false });
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => zustandStorage),
//     },
//   ),
// );

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AuthSession,
  AuthUser,
  AuthCredentials,
  AuthResult,
  OAuthProvider,
} from "../lib/core";
import { SupabaseAuthProvider } from "../lib/supabase/provider";
import { zustandStorage } from "@/lib/storage/persist-storage";

const provider = new SupabaseAuthProvider();

type State = {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type Actions = {
  signIn: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
  signUp: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
  signOut: () => Promise<void>;
  signInWithProvider: (
    provider: OAuthProvider,
  ) => Promise<AuthResult<AuthSession>>;
  refreshSession: () => Promise<void>;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      /**
       * Sign in with email and password
       */
      signIn: async (credentials) => {
        set({ isLoading: true });
        const result = await provider.signIn(credentials);

        if (result.data) {
          set({
            session: result.data,
            user: result.data.user,
            isAuthenticated: true,
          });
        }

        set({ isLoading: false });
        return result;
      },

      /**
       * Sign up a new user
       */
      signUp: async (credentials) => {
        set({ isLoading: true });
        const result = await provider.signUp(credentials);

        if (result.data) {
          set({
            session: result.data,
            user: result.data.user,
            isAuthenticated: true,
          });
        }

        set({ isLoading: false });
        return result;
      },

      /**
       * Sign out the user
       */
      signOut: async () => {
        set({ isLoading: true });
        await provider.signOut();
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * Sign in with an OAuth provider (Google, GitHub, etc.)
       */
      signInWithProvider: async (providerName) => {
        set({ isLoading: true });
        const result = await provider.signInWithProvider(providerName);

        if (result.data) {
          set({
            session: result.data,
            user: result.data.user,
            isAuthenticated: true,
          });
        }

        set({ isLoading: false });
        return result;
      },

      /**
       * Refresh the session to prevent expiration
       */
      refreshSession: async () => {
        const result = await provider.refreshSession();

        if (result.data) {
          set({
            session: result.data,
            user: result.data.user,
            isAuthenticated: true,
          });
        } else {
          set({ session: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/**
 * Sync the auth store with Supabase in real-time
 */
provider.onAuthStateChange(({ session, user }) => {
  useAuthStore.setState({
    session: session || null,
    user: user || null,
    isAuthenticated: !!session,
  });
});
