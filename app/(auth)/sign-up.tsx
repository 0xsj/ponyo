import React, { useState, useRef } from "react";
import { AuthNav } from "@/components/auth-nav";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { router } from "expo-router";
import { TextInput } from "@/components/ui/text-input";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Icon } from "@/components/icon";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendVerification = () => {
    // Implementation will go here
  };

  const handleResendVerification = () => {
    // Implementation will go here
  };

  const handleVerifyAndCreateAccount = () => {
    // Implementation will go here
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

            {error && (
              <Box bg="error" p="sm" borderRadius="md" mb="md">
                <Text color="foreground">{error}</Text>
              </Box>
            )}

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
                editable={!verificationSent}
              />
              {!verificationSent && (
                <Touchable
                  style={{ position: "absolute", justifyContent: "center" }}
                  right={0}
                  top={0}
                  bottom={0}
                  px="md"
                  onPress={handleSendVerification}
                  disabled={!email || isLoading}
                >
                  <Icon
                    name="arrow-right-circle"
                    color={!email || isLoading ? "muted" : "primary"}
                  />
                </Touchable>
              )}
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
                editable={!verificationSent}
              />
            </Box>

            {verificationSent && (
              <>
                <Box style={{ position: "relative" }} mb="md">
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

                <Box flexDir="row" justify="space-between" align="center">
                  <Text color="muted" fontSize="sm">
                    Check database for your verification code.
                  </Text>

                  {countdown > 0 ? (
                    <Text color="primary" fontSize="sm">
                      {countdown}s
                    </Text>
                  ) : (
                    <Touchable
                      onPress={handleResendVerification}
                      disabled={isLoading || !canResend}
                    >
                      <Text
                        color={canResend ? "primary" : "muted"}
                        fontSize="sm"
                      >
                        Resend
                      </Text>
                    </Touchable>
                  )}
                </Box>
              </>
            )}
          </Box>

          <Touchable
            onPress={
              verificationSent
                ? handleVerifyAndCreateAccount
                : handleSendVerification
            }
            disabled={
              isLoading ||
              (!verificationSent && (!email || !password)) ||
              (verificationSent && !verificationCode)
            }
            bg="foreground"
            p="md"
            borderRadius="lg"
            mb={20}
          >
            <Text fontWeight="semibold" align="center" color="background">
              {isLoading
                ? "Please wait..."
                : verificationSent
                  ? "Verify & Create Account"
                  : "Send Verification Code"}
            </Text>
          </Touchable>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}