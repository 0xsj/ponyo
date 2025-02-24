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

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
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
      <Box flex={1} justify="center" align="center">
        <Text fontSize="lg" color="foreground">
          Login
        </Text>
      </Box>
    </SafeAreaView>
  );
}
