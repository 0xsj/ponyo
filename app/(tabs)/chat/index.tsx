import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ChatList } from "./(components)/_chat-list";
import useChatData from "./(hooks)/use-chat-data";

export default function ChatScreen() {
  const { chatItems, isLoading, isRefreshing, handleRefresh, handleChatPress } =
    useChatData();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={{ flex: 1 }} bg="background">
        <Box style={{ flex: 1 }}>
          <Box px="md" py="md" bg="background">
            <Text fontSize="xl" fontWeight="bold" color="foreground">
              Messages
            </Text>
          </Box>

          <ChatList
            chatItems={chatItems}
            isLoading={isLoading}
            onItemPress={handleChatPress}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            ListHeaderComponent={
              <Box px="md" py="md">
                <Text fontSize="md" fontWeight="semibold" color="muted">
                  Recent chats
                </Text>
              </Box>
            }
          />
        </Box>
      </SafeAreaView>
    </>
  );
}
