import React, { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Box } from "@/components/ui/box";
import { ChatItem, ChatItemProps } from "./_chat-item";
import { Text } from "@/components/ui/text";
import { TextInput } from "@/components/ui/text-input";

interface ChatData extends Omit<ChatItemProps, "onPress"> {}

interface ChatListProps {
  chatItems: ChatData[];
  isLoading?: boolean;
  onItemPress?: (id: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  showSearch?: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({
  chatItems,
  isLoading = false,
  onItemPress,
  onRefresh,
  isRefreshing = false,
  ListEmptyComponent,
  ListHeaderComponent,
  showSearch = true,
}) => {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery
    ? chatItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chatItems;

  // Render skeleton loading items when loading
  const renderSkeletonItems = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <Box key={`skeleton-${index}`} p="md" flexDir="row" align="center">
          <Box
            w={50}
            h={50}
            borderRadius="full"
            bg="surfaceHover"
            opacity={0.5}
          />
          <Box style={{ flex: 1 }} ml="md">
            <Box
              w={100}
              h={16}
              mb="sm"
              borderRadius="md"
              bg="surfaceHover"
              opacity={0.5}
            />
            <Box
              w={width * 0.6}
              h={14}
              borderRadius="md"
              bg="surfaceHover"
              opacity={0.5}
            />
          </Box>
        </Box>
      ));
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <Box>{renderSkeletonItems()}</Box>;
    }

    if (searchQuery && filteredItems.length === 0) {
      return (
        <Box py="xl" align="center" justify="center">
          <Text color="muted" fontSize="md">
            No chats matching "{searchQuery}"
          </Text>
        </Box>
      );
    }

    return (
      ListEmptyComponent || (
        <Box py="xl" align="center" justify="center">
          <Text color="muted" fontSize="md">
            No chats yet
          </Text>
        </Box>
      )
    );
  };

  return (
    <Box style={{ flex: 1 }} bg="background">
      {showSearch && (
        <Box p="md" bg="background">
          <Box>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search chats..."
              placeholderColor="muted"
              px="md"
              py="sm"
              bg="surface"
              borderRadius="md"
            />
          </Box>
        </Box>
      )}

      <FlashList
        data={filteredItems}
        renderItem={({ item }) => (
          <ChatItem {...item} onPress={() => onItemPress?.(item.id)} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={76} // Approximate height of each chat item
        ListEmptyComponent={renderEmptyComponent()}
        ListHeaderComponent={ListHeaderComponent}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
});


export default () => null;