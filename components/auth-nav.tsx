import { Box } from "./ui/box";
import { Touchable } from "./ui/touchable";
import { Text } from "./ui/text";
import { router } from "expo-router";
import { Icon } from "./icon";

interface AuthNavProps {
  title?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const AuthNav: React.FC<AuthNavProps> = ({ title, action }) => {
  return (
    <Box flexDir="row" justify="space-between" align="center" px="md" py="sm">
      <Touchable
        p="xs"
        onPress={() => router.push("/(auth)/auth")}
        pressableStyle={{
          pressed: { opacity: 0.7 },
        }}
      >
        {/* <Text fontSize="md" color="foreground">
          ←
        </Text> */}
        <Icon name={"chevron-left"} />
      </Touchable>

      <Text fontSize="md" color="foreground">
        {title}
      </Text>

      {action ? (
        <Touchable
          p="xs"
          onPress={action.onPress}
          pressableStyle={{
            pressed: { opacity: 0.7 },
          }}
        >
          <Text fontWeight="bold" fontSize="md" color="foreground">
            {action.label}
          </Text>
        </Touchable>
      ) : (
        <Box w={24} />
      )}
    </Box>
  );
};
