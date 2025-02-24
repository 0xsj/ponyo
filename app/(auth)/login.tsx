// app/(auth)/login.tsx
import { useState } from "react";
import { AuthCredentials } from "@/api/auth/domain/auth.entity";
import { useAuth } from "@/hooks/useAuth";
import { TextInput } from "@/components/ui/text-input";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Box } from "@/components/ui/box";
import { AuthNav } from "@/components/auth-nav";
import { router } from "expo-router";
import { Touchable } from "@/components/ui/touchable";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("please enter email and password");
      return;
    }

    const credentials: AuthCredentials = {
      identifier: email,
      secret: password,
    };

    const result = await signIn(credentials);

    if (result.isErr()) {
      const error = result.unwrapErr();

      setError(error.message);
      return;
    }
  };

  return (
    <SafeAreaView flex={1} bg="background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <AuthNav
          action={{
            label: "sign up",
            onPress: () => router.push("/(auth)/sign-up"),
          }}
        />

        <Box flex={1} justify="space-between" px="lg">
          <Box mb="lg">
            <Text color="foreground" fontWeight="bold" fontSize="lg" my={30}>
              Log in
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderColor="muted"
              autoCapitalize="none"
              keyboardType="email-address"
              bg="surface"
              p="md"
              borderRadius="md"
              mb="md"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderColor="muted"
              secureTextEntry
              bg="surface"
              p="md"
              borderRadius="md"
            />
          </Box>
          <Touchable
            onPress={handleLogin}
            disabled={isLoading}
            bg="foreground"
            p="md"
            borderRadius="lg"
          >
            <Text align="center" color="background">
              {isLoading ? "Logging in..." : "Log in"}
            </Text>
          </Touchable>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
