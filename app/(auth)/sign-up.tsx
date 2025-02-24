import { useState } from "react";
import { AuthNav } from "@/components/auth-nav";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { router } from "expo-router";
import { TextInput } from "@/components/ui/text-input";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      console.log("handle send verification");
    } catch (error) {
      setError("womp womp");
    } finally {
      setIsLoading(false);
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
            label: "Login",
            onPress: () => router.push("/(auth)/login"),
          }}
        />
        <Box flex={1} justify="space-between" px="lg">
          <Box mb="lg">
            <Text color="foreground" fontWeight="bold" fontSize="lg" my={30}>
              Sign up
            </Text>

            <Box style={{ position: "relative" }} mb="md">
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
              />
              <Touchable
                style={{ position: "absolute", justifyContent: "center" }}
                right={0}
                top={0}
                bottom={0}
                px="md"
                onPress={handleSendVerification}
                disabled={!email || isLoading}
              >
                <Text color="primary">→</Text>
              </Touchable>
            </Box>

            <Box>
              <TextInput
                color="foreground"
                value={password}
                onChangeText={setPassword}
                placeholder="Create password"
                placeholderColor="muted"
                secureTextEntry
                bg="surface"
                p="md"
                borderRadius="md"
                mb="md"
              />
            </Box>

            <Box>
              <TextInput
                color="foreground"
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter verification code"
                placeholderColor="muted"
                keyboardType="number-pad"
                bg="surface"
                p="md"
                borderRadius="md"
              />
            </Box>
          </Box>

          <Touchable
            onPress={() => {}}
            disabled={isLoading}
            bg="foreground"
            p="md"
            borderRadius="lg"
            mb={20}
          >
            <Text fontWeight="semibold" align="center" color="background">
              Create account
            </Text>
          </Touchable>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
