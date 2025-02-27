import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AppProvider } from "@/lib/providers/app-provider";
import { useAuthStore } from "@/store/auth.store";
import React from "react";

SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(tabs)";

    if (!isLoading) {
      if (!session && !inAuthGroup) {
        router.replace("/(auth)/auth");
      } else if (session && inAuthGroup) {
        router.replace("/(tabs)/");
      }
    }
  }, [session, segments, isLoading]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isFirstRender = useRef(true);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && isFirstRender.current) {
      console.log("AppLoaded");
      SplashScreen.hideAsync();
      isFirstRender.current = false;
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <Stack>
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, animation: "fade" }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthGuard>
      </ThemeProvider>
    </AppProvider>
  );
}
