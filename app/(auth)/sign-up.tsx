import React, { useState, useEffect, useRef } from "react";
import { AuthNav } from "@/components/auth-nav";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { router } from "expo-router";
import { TextInput } from "@/components/ui/text-input";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Icon } from "@/components/icon";
// import { useAuth } from "@/hooks/useAuth";

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (verificationSent && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [verificationSent]);

  const handleSendVerification = async () => {
    // if (!email || !password) {
    //   setError("Email and password are required");
    //   return;
    // }
    // setError(null);
    // try {
    //   const result = await requestEmailVerification(email, password);
    //   if (result.isErr()) {
    //     const err = result.unwrapErr();
    //     setError(err.message);
    //     return;
    //   }
    //   setCountdown(60);
    //   setCanResend(false);
    //   setVerificationSent(true);
    // } catch (error) {
    //   setError("An unexpected error occurred. Please try again.");
    //   console.error(error);
    // }
  };

  const handleResendVerification = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError(null);

    // try {
    //   const result = await requestEmailVerification(email, password);

    //   if (result.isErr()) {
    //     const err = result.unwrapErr();
    //     setError(err.message);
    //     return;
    //   }

    //   setCountdown(60);
    //   setCanResend(false);
    // } catch (error) {
    //   setError("An unexpected error occurred. Please try again.");
    //   console.error(error);
    // }
  };

  const handleVerifyAndCreateAccount = async () => {
    if (!email || !password || !verificationCode) {
      setError("Email, password, and verification code are required");
      return;
    }

    setError(null);

    // try {
    //   const verifyResult = await verifyEmail({
    //     email,
    //     code: verificationCode,
    //   });

    //   if (verifyResult.isErr()) {
    //     const err = verifyResult.unwrapErr();
    //     setError(err.message);
    //     return;
    //   }

    //   router.replace("/(tabs)");
    // } catch (error) {
    //   setError("An unexpected error occurred. Please try again.");
    //   console.error(error);
    // }
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
