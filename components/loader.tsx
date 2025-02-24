import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "./ui/safe-area-view";
import { Text } from "./ui/text";

export const LoadingScreen = () => {
  return (
    <SafeAreaView flex={1} justify="center" align="center" bg="background">
      <ActivityIndicator size={"large"} />
      <Text fontWeight="bold" color="primary" fontSize="xxl">
        Ponyo
      </Text>
    </SafeAreaView>
  );
};
