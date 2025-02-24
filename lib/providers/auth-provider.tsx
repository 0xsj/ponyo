import { getAuthStore } from "@/store/auth.store";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { PropsWithChildren, useEffect } from "react";
import { authClient } from "@/lib/supabase/auth-client";

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const segments = useSegments();
  const store = getAuthStore();
  const isAuthenticated = store((state) => state.isAuthenticated);

  useEffect(() => {
    const initAuth = async () => {
      const result = await authClient.getSession();
      if (result.isOk()) {
        const session = result.unwrap();
        if (session) {
          store.getState().setSession(session);
        }
      }
    };

    const unsubscribe = authClient.subscribeToAuthChanges((session) => {
      if (session) {
        store.getState().setSession(session);
      } else {
        store.getState().reset();
      }
    });

    initAuth();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/auth");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}
