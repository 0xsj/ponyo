// hooks/useAuth.ts
import { useCallback, useEffect } from "react";
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

  // Function to sync user data with the store
  const syncUserData = useCallback(
    async (userId: string) => {
      console.log("useAuth: Syncing user data for:", userId);
      try {
        const userResult = await userQueries.getUser(userId);
        if (userResult.isOk()) {
          const user = userResult.unwrap();
          if (user) {
            console.log("useAuth: Successfully retrieved user data");
            userStore.getState().setCurrentUser(user);
            return true;
          } else {
            console.log("useAuth: User data is null");
          }
        } else {
          console.error("useAuth: Failed to get user data:", userResult.unwrapErr());
        }
        return false;
      } catch (error) {
        console.error("useAuth: Failed to sync user data:", error);
        return false;
      }
    },
    [userQueries],
  );
  
  // Periodically check session validity
  useEffect(() => {
    if (!state.isAuthenticated) return;
    
    console.log("useAuth: Setting up session validity check");
    
    // Check session validity initially
    checkSessionValidity();
    
    // Set up interval to check session validity
    const intervalId = setInterval(checkSessionValidity, 60000); // Check every minute
    
    return () => {
      console.log("useAuth: Clearing session validity check interval");
      clearInterval(intervalId);
    };
  }, [state.isAuthenticated]);
  
  // Function to check if the session is valid
  const checkSessionValidity = useCallback(async () => {
    if (!state.isAuthenticated) {
      console.log("useAuth: Not checking session validity - not authenticated");
      return;
    }
    
    console.log("useAuth: Checking session validity");
    try {
      const isValid = await queries.isSessionValid();
      
      if (!isValid) {
        console.log("useAuth: Session invalid or expired, attempting refresh");
        const refreshResult = await queries.refreshSession();
        
        if (refreshResult.isErr()) {
          console.error("useAuth: Failed to refresh session:", refreshResult.unwrapErr());
          // Session is invalid and can't be refreshed, sign out
          console.log("useAuth: Signing out due to invalid session");
          await signOut();
        } else {
          console.log("useAuth: Session refreshed successfully");
          const session = refreshResult.unwrap();
          authStore.getState().setSession(session);
          authStore.getState().setUser(session.user);
        }
      } else {
        console.log("useAuth: Session is valid");
      }
    } catch (error) {
      console.error("useAuth: Error checking session validity:", error);
    }
  }, [state.isAuthenticated, queries]);

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      console.log("useAuth: Signing in user with identifier:", credentials.identifier);
      authStore.getState().setLoading(true);
      
      try {
        console.log("useAuth: Calling auth service signIn");
        const result = await queries.signIn(credentials);
        
        if (result.isOk()) {
          const session = result.unwrap();
          console.log("useAuth: Sign in successful:", {
            hasSession: !!session,
            hasUser: !!session.user,
            expiresAt: session.expiresAt
          });
          
          authStore.getState().setSession(session);
          
          if (session.user) {
            authStore.getState().setUser(session.user);
            console.log("useAuth: Syncing user data for:", session.user.id);
            await syncUserData(session.user.id);
          } else {
            console.warn("useAuth: Session has no user data");
          }
        } else {
          const error = result.unwrapErr();
          console.error("useAuth: Sign in failed:", {
            kind: error.kind,
            code: error.code,
            message: error.message
          });
        }
        
        return result;
      } catch (error) {
        console.error("useAuth: Unexpected error during sign in:", error);
        throw error;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries, syncUserData],
  );

  const signUp = useCallback(
    async (credentials: AuthCredentials) => {
      console.log("useAuth: Signing up user with identifier:", credentials.identifier);
      authStore.getState().setLoading(true);
      
      try {
        const result = await queries.signUp(credentials);
        
        if (result.isOk()) {
          console.log("useAuth: Sign up successful");
        } else {
          const error = result.unwrapErr();
          console.error("useAuth: Sign up failed:", {
            kind: error.kind,
            code: error.code,
            message: error.message
          });
        }
        
        return result;
      } catch (error) {
        console.error("useAuth: Unexpected error during sign up:", error);
        throw error;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries],
  );

  const requestEmailVerification = useCallback(
    async (email: string) => {
      console.log("useAuth: Requesting email verification for:", email);
      authStore.getState().setLoading(true);
      
      try {
        const result = await queries.requestEmailVerification(email);
        
        if (result.isOk()) {
          console.log("useAuth: Email verification request successful");
        } else {
          const error = result.unwrapErr();
          console.error("useAuth: Email verification request failed:", {
            kind: error.kind,
            code: error.code,
            message: error.message
          });
        }
        
        return result;
      } catch (error) {
        console.error("useAuth: Unexpected error requesting email verification:", error);
        throw error;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries],
  );

  const verifyEmail = useCallback(
    async (data: EmailVerificationSubmit) => {
      console.log("useAuth: Verifying email for:", data.email);
      authStore.getState().setLoading(true);
      
      try {
        const result = await queries.verifyEmail(data);
        
        if (result.isOk()) {
          const session = result.unwrap();
          console.log("useAuth: Email verification successful:", {
            hasSession: !!session,
            hasUser: !!session.user
          });
          
          authStore.getState().setSession(session);
          authStore.getState().setUser(session.user);
          
          if (session.user) {
            console.log("useAuth: Syncing user data after email verification");
            await syncUserData(session.user.id);
          }
        } else {
          const error = result.unwrapErr();
          console.error("useAuth: Email verification failed:", {
            kind: error.kind,
            code: error.code,
            message: error.message
          });
        }
        
        return result;
      } catch (error) {
        console.error("useAuth: Unexpected error during email verification:", error);
        throw error;
      } finally {
        authStore.getState().setLoading(false);
      }
    },
    [queries, syncUserData],
  );

  const signOut = useCallback(async () => {
    console.log("useAuth: Signing out user - starting");
    authStore.getState().setLoading(true);
    
    try {
      // Check current session state before signing out
      const sessionBefore = await queries.getSession();
      console.log("useAuth: Current session before sign out:", {
        hasSession: sessionBefore.isOk() && !!sessionBefore.unwrap(),
        error: sessionBefore.isErr() ? sessionBefore.unwrapErr().message : null
      });
      
      console.log("useAuth: Calling auth service signOut");
      const result = await queries.signOut();
      
      if (result.isOk()) {
        console.log("useAuth: Sign out successful, clearing auth and user stores");
      } else {
        console.error("useAuth: Sign out failed:", result.unwrapErr());
        console.log("useAuth: Clearing auth and user stores anyway");
      }
      
      // Clear stores regardless of API result
      authStore.getState().setSession(null);
      authStore.getState().setUser(null);
      userStore.getState().setCurrentUser(null);
      
      // Verify stores are cleared
      console.log("useAuth: Store state after clearing:", {
        hasSession: !!authStore.getState().session,
        hasUser: !!authStore.getState().user,
        hasCurrentUser: !!userStore.getState().currentUser
      });
      
      return result;
    } catch (error) {
      console.error("useAuth: Unexpected error during sign out:", error);
      
      // Clear stores even if there's an error
      console.log("useAuth: Error during sign out, clearing stores anyway");
      authStore.getState().setSession(null);
      authStore.getState().setUser(null);
      userStore.getState().setCurrentUser(null);
      
      throw error;
    } finally {
      authStore.getState().setLoading(false);
    }
  }, [queries]);

  // Check and sync session whenever auth changes
  const checkAndSyncSession = useCallback(async () => {
    console.log("useAuth: Checking and syncing session");
    
    if (state.user && userStore.getState().currentUser) {
      console.log("useAuth: User already in both stores");
      return true;
    }
    
    if (state.user && !userStore.getState().currentUser) {
      console.log("useAuth: User in auth store but not in user store, syncing");
      return await syncUserData(state.user.id);
    }
    
    // If we have no user but we have a session, try to refresh
    if (!state.user && state.session) {
      console.log("useAuth: Session exists but no user, checking validity");
      await checkSessionValidity();
      return state.user != null;
    }
    
    console.log("useAuth: No session or user found");
    return false;
  }, [state.user, state.session, syncUserData, checkSessionValidity]);

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
    checkSessionValidity,
  };
};