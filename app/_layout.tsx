import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const {users} = useUser()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log("AppLoaded");
      SplashScreen.hideAsync();

      console.log(users)
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded || authLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, loaded, authLoading]);

  if (!loaded || authLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
