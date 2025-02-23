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
    <Box flex={1} align="center" justify="center">
      <Text color="foreground">hello world</Text>
      <Box pt={30}>
        <Touchable
          bg="foreground"
          p={16}
          borderRadius={8}
          onPress={handleSignOut}
        >
          <Text color="background" size={16}>
            Sign Out
          </Text>
        </Touchable>
      </Box>
    </Box>
  );
}
