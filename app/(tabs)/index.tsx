import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";
import { useModules } from "@/lib/providers/app-provider";
import { useSignOut } from "@/api/auth/use-auth";

export default function HomeScreen() {
  const { auth } = useModules();
  const signOutMutation = useSignOut(auth.service);
  const handleSignOut = async () => {
    signOutMutation.mutate();
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
          pressableStyle={{
            pressed: {
              opacity: 0.7,
            },
            default: {
              opacity: 1,
            },
          }}
        >
          <Text color="background" fontSize="sm">
            Sign Out
          </Text>
        </Touchable>
      </Box>
    </Box>
  );
}
