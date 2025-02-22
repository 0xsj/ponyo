import { useCallback } from "react";
import { getAuthStore } from "@/store/auth.store";
import { AuthCredentials } from "@/api/auth/auth.entity";
import { useService } from "@/lib/providers/app-provider";

export const useAuth = () => {
  const { queries } = useService("auth");
  const store = getAuthStore();
  const state = store();

  const signIn = useCallback(async (credentials: AuthCredentials) => {
    store.getState().setLoading(true);
    const result = await queries.signIn(credentials);
    store.getState().setLoading(false);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    store.getState().setLoading(true);
    const result = await queries.signOut();
    store.getState().setLoading(false);
    return result;
  }, []);

  const isAuthenticated = !!state.session || !!state.user;

  return {
    ...state,
    signIn,
    signOut,
    isAuthenticated
  };
};
