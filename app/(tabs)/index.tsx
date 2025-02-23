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
    <Box lightColor="#f0f0f0" darkColor="#222222" flex={1} center middle>
      <Text lightColor={"#222222"} darkColor={"#f0f0f0"}>hello world</Text>
    </Box>
  );
}
