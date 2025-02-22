import { useAuth } from "@/hooks/useAuth";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

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
      <Text>hello world</Text>
    </Box>
  );
}
