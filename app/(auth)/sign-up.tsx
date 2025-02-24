import { AuthNav } from "@/components/auth-nav";
import { Box } from "@/components/ui/box";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { router } from "expo-router";

export default function SignUpScreen() {
  return (
    <SafeAreaView bg="background" flex={1}>
      <AuthNav
        action={{
          label: "login",
          onPress: () => router.push("/(auth)/login"),
        }}
      />

      <Box flex={1} justify="center" align="center">
        <Text color="foreground">Sign up screen</Text>
      </Box>
    </SafeAreaView>
  );
}
