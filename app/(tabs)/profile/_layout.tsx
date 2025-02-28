import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { theme } from "@/theme/theme";

export default function ProfileLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors[colorScheme].background,
        },
      }}
    >
      <Stack.Screen name="index" options={{}} />

      <Stack.Screen
        name="[id]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
