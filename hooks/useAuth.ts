// hooks/useAuth.ts
import { useCallback } from "react";
import { getAuthStore } from "@/store/auth.store";
import {
  AuthCredentials,
  EmailVerificationSubmit,
} from "@/api/auth/domain/auth.entity";
import { useService } from "@/lib/providers/service-provider";
import { getUserStore } from "@/store/user.store";

export const useAuth = () => {
  const { queries } = useService("auth");
  const { queries: userQueries } = useService("user");
  const userStore = getUserStore();
  const authStore = getAuthStore();
  const state = authStore();

  const syncUserData = useCallback(
    async (userId: string) => {
      try {
        const userResult = await userQueries.getUser(userId);
        if (userResult.isOk()) {
          const user = userResult.unwrap();
          if (user) {
            userStore.getState().setCurrentUser(user);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Failed to sync user data:", error);
        return false;
      }
    },
    [userQueries],
  );

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      authStore.getState().setLoading(true);

      try {
        const result = await queries.signIn(credentials);

        if (result.isOk()) {
          const session = result.unwrap();
          authStore.getState().setSession(session);
          authStore.getState().setUser(session.user);

          if (session.user) {
            await syncUserData(session.user.id);
          }
        }

        return result;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries, syncUserData],
  );

  const signUp = useCallback(
    async (credentials: AuthCredentials) => {
      authStore.getState().setLoading(true);
      const result = await queries.signUp(credentials);
      authStore.getState().setLoading(false);
      return result;
    },
    [queries],
  );

  const requestEmailVerification = useCallback(
    async (email: string) => {
      authStore.getState().setLoading(true);
      const result = await queries.requestEmailVerification(email);
      authStore.getState().setLoading(false);
      return result;
    },
    [queries],
  );

  const verifyEmail = useCallback(
    async (data: EmailVerificationSubmit) => {
      authStore.getState().setLoading(true);

      try {
        const result = await queries.verifyEmail(data);

        if (result.isOk()) {
          const session = result.unwrap();
          authStore.getState().setSession(session);
          authStore.getState().setUser(session.user);

          if (session.user) {
            await syncUserData(session.user.id);
          }
        }

        return result;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries, syncUserData],
  );

  const signOut = useCallback(async () => {
    authStore.getState().setLoading(true);

    try {
      const result = await queries.signOut();
      authStore.getState().setSession(null);
      authStore.getState().setUser(null);
      userStore.getState().setCurrentUser(null);
      return result;
    } finally {
      authStore.getState().setLoading(false);
    }
  }, [queries]);

  const checkAndSyncSession = useCallback(async () => {
    if (state.user && userStore.getState().currentUser) {
      return true;
    }

    if (state.user && !userStore.getState().currentUser) {
      return await syncUserData(state.user.id);
    }

    return false;
  }, [state.user, syncUserData]);

  const isAuthenticated = !!state.session || !!state.user;

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    requestEmailVerification,
    verifyEmail,
    isAuthenticated,
    checkAndSyncSession,
  };
};
