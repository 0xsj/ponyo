import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ScrollView, RefreshControl } from "react-native";
import { useState } from "react";

export default function ProfileScreen() {
  // const { user, authUser, refreshUser, isLoading } = useSyncUser();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box darkBg="red" flex={1} justify="center" align="center">
        <Text color="foreground" fontSize={"md"} fontWeight="bold" mb={16}>
          Profile
        </Text>
      </Box>
    </ScrollView>
  );
}
