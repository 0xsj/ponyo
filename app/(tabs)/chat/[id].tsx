import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TextInput as RNTextInput, Keyboard } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Touchable } from "@/components/ui/touchable";
import { TextInput } from "@/components/ui/text-input";
import { ScrollView } from "@/components/ui/scroll-view";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export default function ChatDetailScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        text: "Hey there!",
        timestamp: "10:30 AM",
        isCurrentUser: false,
      },
      {
        id: "2",
        text: "Hi! How are you doing?",
        timestamp: "10:31 AM",
        isCurrentUser: true,
      },
      {
        id: "3",
        text: "I'm doing well, thanks for asking. Do you have time to catch up this week?",
        timestamp: "10:32 AM",
        isCurrentUser: false,
      },
    ];

    setMessages(initialMessages);

    // Scroll to bottom after a short delay to ensure messages are rendered
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }, [id]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Add new message to the list
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCurrentUser: false,
      };

      setMessages((prev) => [...prev, replyMessage]);
      scrollToBottom();
    }, 2000);

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const renderMessageBubble = (item: Message) => {
    return (
      <Box
        key={item.id}
        alignSelf={item.isCurrentUser ? "flex-end" : "flex-start"}
        maxW="80%"
        mb="md"
      >
        <Box
          bg={item.isCurrentUser ? "primary" : "surface"}
          p="md"
          borderRadius="lg"
        >
          <Text
            color={item.isCurrentUser ? "background" : "foreground"}
            fontSize="md"
          >
            {item.text}
          </Text>
        </Box>
        <Text fontSize="xs" color="muted" mt="xs">
          {item.timestamp}
        </Text>
      </Box>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          //   tabBarStyle: { display: 'none' }
        }}
      />
      <SafeAreaView style={{ flex: 1 }} bg="background">
        {/* Header */}
        <Box flexDir="row" align="center" p="md">
          <Touchable
            onPress={() => router.back()}
            pressableStyle={{
              pressed: { opacity: 0.7 },
            }}
          >
            <Box
              p="xs"
              mr="md"
              borderRadius="full"
              bg="surface"
              w={40}
              h={40}
              align="center"
              justify="center"
            >
              <Text fontSize="lg" fontWeight="medium">
                ←
              </Text>
            </Box>
          </Touchable>
          <Text fontSize="lg" fontWeight="semibold">
            {name || "Chat"}
          </Text>
        </Box>

        {/* Message List */}
        <Box style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            px="md"
            pt="md"
            contentContainerStyle={styles.messageContainer}
          >
            {messages.map(renderMessageBubble)}
          </ScrollView>
        </Box>

        {/* Message Input */}
        <Box flexDir="row" p="md" align="center" bg="background">
          <Box style={{ flex: 1 }} mr="sm">
            <TextInput
              ref={inputRef}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderColor="muted"
              bg="surface"
              p="md"
              borderRadius="lg"
              multiline
              style={styles.input}
            />
          </Box>
          <Touchable
            onPress={handleSendMessage}
            pressableStyle={{
              pressed: { opacity: 0.8 },
            }}
          >
            <Box
              w={44}
              h={44}
              borderRadius="full"
              bg="primary"
              align="center"
              justify="center"
            >
              <Text color="background" fontSize="md" fontWeight="bold">
                →
              </Text>
            </Box>
          </Touchable>
        </Box>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexGrow: 1,
  },
  input: {
    maxHeight: 100,
  },
});
