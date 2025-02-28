import React from "react";
import { Image, StyleSheet, ImageSourcePropType } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Touchable } from "@/components/ui/touchable";

export type MessageStatus = "sent" | "delivered" | "read" | "failed";

export interface ChatItemProps {
  id: string;
  avatar?: ImageSourcePropType;
  name: string;
  message: string;
  timestamp: string;
  unreadCount?: number;
  status?: MessageStatus;
  isOnline?: boolean;
  isCurrentUser?: boolean;
  onPress?: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  avatar,
  name,
  message,
  timestamp,
  unreadCount = 0,
  status = "sent",
  isOnline = false,
  onPress,
}) => {
  return (
    <Touchable
      onPress={onPress}
      pressableStyle={{
        pressed: { opacity: 0.7, backgroundColor: "surfaceHover" },
        default: { backgroundColor: "background" },
      }}
    >
      <Box p="md" flexDir="row" align="center" bg="background">
        {/* Avatar with online indicator */}
        <Box pos="relative">
          <Box
            w={50}
            h={50}
            borderRadius="full"
            //   overflow="hidden"
            bg="surface"
          >
            {avatar ? (
              <Image source={avatar} style={styles.avatar} resizeMode="cover" />
            ) : (
              <Box flex={1} bg="muted" justify="center" align="center">
                <Text color="background" fontSize="lg" fontWeight="bold">
                  {name.charAt(0).toUpperCase()}
                </Text>
              </Box>
            )}
          </Box>

          {/* Online status indicator */}
          {isOnline && (
            <Box
              style={{ borderWidth: 2, borderColor: "background" }}
              pos="absolute"
              bottom={0}
              right={0}
              w={14}
              h={14}
              borderRadius="full"
              bg="success"
            />
          )}
        </Box>

        {/* Content */}
        <Box style={{ flex: 1 }} ml="md">
          <Box flexDir="row" justify="space-between" align="center" mb="xs">
            <Text fontSize="md" fontWeight="semibold" color="foreground">
              {name}
            </Text>
            <Text fontSize="xs" color="muted">
              {timestamp}
            </Text>
          </Box>

          <Box flexDir="row" justify="space-between" align="center">
            <Text
              fontSize="sm"
              color="muted"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: "85%" }}
            >
              {message}
            </Text>

            {/* Unread counter or status */}
            {unreadCount > 0 ? (
              <Box
                bg="primary"
                borderRadius="full"
                minW={22}
                h={22}
                justify="center"
                align="center"
                px="xs"
              >
                <Text fontSize="xs" color="background" fontWeight="bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </Box>
            ) : (
              status === "failed" && (
                <Box
                  w={20}
                  h={20}
                  bg="error"
                  borderRadius="full"
                  justify="center"
                  align="center"
                >
                  <Text fontSize="xs" color="background">
                    !
                  </Text>
                </Box>
              )
            )}
          </Box>
        </Box>
      </Box>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: "100%",
    height: "100%",
  },
});


export default () => null;