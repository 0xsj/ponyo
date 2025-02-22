import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { getAuthStore } from "@/store/auth.store";

export function useProtectedRoute(route: string = "(auth)/login") {
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Use Zustand's `useStore` hook to read the session and isAuthenticated state
  const session = useStore(getAuthStore(), (state) => state.session);
  const isAuthenticated = useStore(getAuthStore(), (state) => state.isAuthenticated);

  console.log("Session:", session); // Log the session
  console.log("isAuthenticated:", isAuthenticated); // Log the isAuthenticated flag

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Redirect to the login page if the user is not authenticated and not already in the auth group
    if (!isAuthenticated && !inAuthGroup) {
      console.log("User is not authenticated. Redirecting to login...");
      router.replace(route);
    }

    // If the user is authenticated and in the auth group, redirect to the home screen
    if (isAuthenticated && inAuthGroup) {
      console.log("User is authenticated. Redirecting to home...");
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isMounted]);
}