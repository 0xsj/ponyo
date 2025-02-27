import React from "react";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { router } from "expo-router";
import { ButtonIcon, Icon } from "@/components/icon";
import { Alert, Linking } from "react-native";

const SOCIAL_BUTTONS: Array<{
  id: string;
  icon: ButtonIcon;
  authUrl?: string;
}> = [
  {
    id: "google",
    icon: { name: "google", iconSet: "fontawesome" },
    authUrl: "https://your-auth-url.com/google",
  },
  {
    id: "facebook",
    icon: { name: "facebook", iconSet: "fontawesome" },
    authUrl: "https://your-auth-url.com/facebook",
  },
  {
    id: "email",
    icon: { name: "mail", iconSet: "feather" },
  },
  {
    id: "discord",
    icon: { name: "discord", iconSet: "fontawesome" },
    authUrl: "https://your-auth-url.com/discord",
  },
  {
    id: "more",
    icon: { name: "more-horizontal", iconSet: "feather" },
  },
];

const LANGUAGE_EXAMPLES = [
  { id: "1", text: "Hello!", lang: "EN" },
  { id: "2", text: "Bonjour!", lang: "FR" },
  { id: "3", text: "你好!", lang: "CN" },
  { id: "4", text: "Hola!", lang: "ES" },
  { id: "5", text: "안녕!", lang: "KR" },
];

export default function AuthScreen() {
  const handleSocialAuth = (provider: string, authUrl?: string) => {
    if (provider === "email") {
      router.push("/(auth)/sign-up");
      return;
    }

    Alert.alert(
      `Sign in with ${provider}`,
      `Would you like to continue signing in with ${provider}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => {
            if (authUrl) {
              console.log(`Opening auth for ${provider}`);
              // Linking.openURL(authUrl);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView flex={1} bg="background">
      <Box flex={1} px="md" pt="lg">
        <Box mb="xl">
          <Text fontSize="xxl" fontWeight="bold" color="primary" mb="sm">
            Hello World
          </Text>
          <Text fontSize="md" color="foreground" mb="sm">
            Lorem Ipsum
          </Text>
          <Text fontSize="md" color="foreground">
            dolor sit amet
          </Text>
        </Box>

        <Box flexDir="row" mb="lg">
          {LANGUAGE_EXAMPLES.map((item) => (
            <Box
              key={item.id}
              bg="surface"
              borderRadius="full"
              px="md"
              py="sm"
              mr="sm"
              mb="sm"
            >
              <Text fontSize="sm" color="foreground">
                {item.text}
              </Text>
            </Box>
          ))}
        </Box>
        <Box flex={1}></Box>

        <Box mb="lg">
          <Touchable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            bg="surface"
            p={"md"}
            mx="md"
            borderRadius="md"
            onPress={() =>
              handleSocialAuth("apple", "https://your-auth-url.com/apple")
            }
            pressableStyle={{
              pressed: { opacity: 0.7 },
            }}
          >
            <Icon
              name="apple"
              iconSet="fontawesome"
              color="foreground"
              size={24}
              style={{ marginRight: 8 }}
            />
            <Text
              fontSize="md"
              fontWeight="medium"
              color="foreground"
              align="center"
            >
              Sign in with Apple
            </Text>
          </Touchable>

          <Box flexDir="row" justify="center" mt="md">
            {SOCIAL_BUTTONS.map((button) => (
              <Touchable
                key={button.id}
                bg="surface"
                p="md"
                mx="sm"
                borderRadius="md"
                onPress={() => handleSocialAuth(button.id, button.authUrl)}
                pressableStyle={{
                  pressed: { opacity: 0.7 },
                }}
              >
                <Icon
                  name={button.icon.name}
                  iconSet={button.icon.iconSet}
                  size={24}
                  color="foreground"
                />
              </Touchable>
            ))}
          </Box>
        </Box>

        <Box align="center" mb="md">
          <Text color="muted" fontSize="xs" align="center">
            Your first login creates your account, and in doing so you agree to
            our{" "}
            <Text color="primary" fontSize="xs" fontWeight="medium">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text color="primary" fontSize="xs" fontWeight="medium">
              Privacy Policy
            </Text>
            .
          </Text>
          <Touchable
            mt="sm"
            pressableStyle={{
              pressed: { opacity: 0.7 },
            }}
          >
            <Text color="muted" fontSize="sm">
              I'm having trouble signing in
            </Text>
          </Touchable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
