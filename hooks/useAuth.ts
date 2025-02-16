import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.session?.user ?? null,
    isAuthenticated: !!store.session,
    isLoading: store.isLoading,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    signInWithProvider: store.signInWithProvider,
  };
};
