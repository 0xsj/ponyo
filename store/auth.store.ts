// stores/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AuthSession,
  AuthUser,
  AuthCredentials,
  AuthResult,
} from "../lib/core";
import { SupabaseAuthProvider } from "../lib/supabase/provider";
import { zustandStorage } from "@/lib/storage/persist-storage";

const provider = new SupabaseAuthProvider();

type State = {
  session: AuthSession | null;
  isLoading: boolean;
};

type Actions = {
  signIn: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
  signUp: (credentials: AuthCredentials) => Promise<AuthResult<AuthSession>>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,

      signIn: async (credentials) => {
        set({ isLoading: true });
        const result = await provider.signIn(credentials);
        if (result.data) {
          set({ session: result.data });
        }
        set({ isLoading: false });
        return result;
      },

      signUp: async (credentials) => {
        set({ isLoading: true });
        const result = await provider.signUp(credentials);
        if (result.data) {
          set({ session: result.data });
        }
        set({ isLoading: false });
        return result;
      },

      signOut: async () => {
        set({ isLoading: true });
        await provider.signOut();
        set({ session: null, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
