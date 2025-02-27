// app/(auth)/login.tsx
import { useState } from "react";
import { TextInput } from "@/components/ui/text-input";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Box } from "@/components/ui/box";
import { AuthNav } from "@/components/auth-nav";
import { router } from "expo-router";
import { Touchable } from "@/components/ui/touchable";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSignIn } from "@/api/auth/use-auth";
import { useModules } from "@/lib/providers/app-provider";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const {auth} = useModules();
  const signInMutation = useSignIn(auth.service);

  const handleLogin = async () => {
    if(!email || !password) {
      setError("email and password are required")
      return;
    }

    try {
      const result = await signInMutation.mutateAsync({
        identifier: email,
        secret: password
      });

      if(result.kind === 'error') {
        setError(result.error.message);

      } else {
        setError(null)
      }
    } catch (error) {
      setError("an unexpcated error has occured")
      console.error(error)
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
            label: "Sign up",
            onPress: () => router.push("/(auth)/sign-up"),
          }}
        />

        <Box flex={1} justify="space-between" px="lg">
          <Box mb="lg">
            <Text color="foreground" fontWeight="bold" fontSize="lg" my={30}>
              Log in
            </Text>
            <TextInput
              color="foreground"
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
              color="foreground"
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
            // disabled={isLoading}
            bg="foreground"
            p="md"
            borderRadius="lg"
            mb={20}
          >
            <Text fontWeight="semibold" align="center" color="background">
              {signInMutation.isPending ? "Logging in...": "Log in"}
            </Text>
          </Touchable>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
