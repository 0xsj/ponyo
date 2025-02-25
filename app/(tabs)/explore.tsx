import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { getUserStore } from "@/store/user.store";

export default function ExploreScreen() {
  const store = getUserStore();
  console.log("(NOBRIDGE) User store:", store.getState());
  return (
    <Box bg="background" flex={1} justify="center" align="center">
      <Text color="foreground">Explore</Text>
    </Box>
  );
}
