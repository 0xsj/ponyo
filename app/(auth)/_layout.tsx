import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // presentation: "modal",
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
