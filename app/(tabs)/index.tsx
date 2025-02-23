import { useAuth } from "@/hooks/useAuth";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";

export default function HomeScreen() {
  const { session, signOut } = useAuth();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.isOk()) {
      console.log("signing out");
      console.log(session);
    } else {
      console.error("sign out failed", result.unwrapErr());
    }
  };

  return (
    <Box flex={1} center middle>
      <Text c="foreground">hello world</Text>
      <Box pt={30}>
        <Touchable
          backgroundColor="foreground"
          p={16}
          borderRadius={8}
          onPress={handleSignOut}
        >
          <Text c="background" size={16} w="bold">
            Sign Out
          </Text>
        </Touchable>
      </Box>
    </Box>
  );
}
