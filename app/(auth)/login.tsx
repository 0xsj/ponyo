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
      <AuthNav
        action={{
          label: "sign up",
          onPress: () => router.push("/(auth)/sign-up"),
        }}
      />

      <Box flex={1} justify="center" px="lg">
        <Box mb="xl">
          <Text color="foreground" mb="md">
            Welcome back
          </Text>
          <Text color="muted">Sign in to your account</Text>
        </Box>

        <Box mb="lg">
          <Text mb="xs" color="foreground">
            Email
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

          <Text mb="xs" color="foreground">
            Password
          </Text>
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

        {error && (
          <Box mb="md" p="md" bg="error" borderRadius="md">
            <Text color="background">{error}</Text>
          </Box>
        )}

        <Touchable
          onPress={handleLogin}
          disabled={isLoading}
          bg="primary"
          p="md"
          borderRadius="md"
        >
          <Text color="background">
            {isLoading ? "Signing in..." : "Sign in"}
          </Text>
        </Touchable>
      </Box>
    </SafeAreaView>
  );
}
