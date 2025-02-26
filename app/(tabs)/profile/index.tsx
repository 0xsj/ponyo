import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useSyncUser } from "@/hooks/useSync";
import { ScrollView, RefreshControl } from "react-native";
import { useState } from "react";

export default function ProfileScreen() {
  const { user, authUser, refreshUser, isLoading } = useSyncUser();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    console.log("onRefresh called in ProfileScreen");
    setRefreshing(true);

    if (refreshUser) {
      console.log("Calling refreshUser function");
      await refreshUser();
      console.log("refreshUser completed");
    } else {
      console.log("refreshUser function is undefined!");
    }

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

        {isLoading ? (
          <Text>Loading profile data...</Text>
        ) : user ? (
          <Box px={16}>
            <Box bg="card" p={16} borderRadius={8} mb={16}>
              <Text fontSize={"md"} fontWeight="bold" mb={8}>
                Account Information
              </Text>
              <Text mb={4}>Username: {user.username}</Text>
              <Text mb={4}>Email: {user.email}</Text>
              <Text mb={4}>Status: {user.account_status || "Active"}</Text>
              <Text mb={4}>
                Email Verified: {user.email_verified ? "Yes" : "No"}
              </Text>
            </Box>

            {authUser && (
              <Box bg="card" p={16} borderRadius={8}>
                <Text fontSize={"md"} fontWeight="bold" mb={8}>
                  Authentication Details
                </Text>
                <Text mb={4}>User ID: {authUser.id}</Text>
                <Text mb={4}>
                  Auth Provider(s):{" "}
                  {authUser.metadata?.providers?.join(", ") || "Email"}
                </Text>
              </Box>
            )}
          </Box>
        ) : (
          <Box align="center">
            <Text>No profile data available</Text>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}
