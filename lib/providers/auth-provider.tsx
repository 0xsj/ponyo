import { getAuthStore } from "@/store/auth.store";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { PropsWithChildren, useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { authClient } from "@/lib/supabase/auth-client";
import { LoadingScreen } from "@/components/loader";

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const segments = useSegments();
  const store = getAuthStore();
  const isAuthenticated = store((state) => state.isAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const [authResult] = await Promise.all([
          authClient.getSession(),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);

        if (authResult.isOk()) {
          const session = authResult.unwrap();
          if (session) {
            store.getState().setSession(session);
          }
        }
      } finally {
        setIsInitializing(false);
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
    if (isInitializing) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/auth");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isInitializing]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
