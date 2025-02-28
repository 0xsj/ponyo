import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ChatItemProps } from "../(components)/_chat-item";

const SAMPLE_CHATS: Omit<ChatItemProps, "onPress">[] = [
  {
    id: "1",
    name: "Alex Johnson",
    message: "Hey, are we still meeting for coffee tomorrow?",
    timestamp: "12:30 PM",
    unreadCount: 2,
    isOnline: true,
    status: "read",
  },
  {
    id: "2",
    name: "Maya Williams",
    message: "I just sent you the project files, let me know what you think!",
    timestamp: "10:45 AM",
    unreadCount: 0,
    isOnline: false,
    status: "read",
  },
  {
    id: "3",
    name: "Ethan Brown",
    message: "Thanks for the help yesterday!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    status: "read",
  },
  {
    id: "4",
    name: "Sophia Garcia",
    message: "Did you see the latest update?",
    timestamp: "Yesterday",
    unreadCount: 5,
    isOnline: false,
    status: "delivered",
  },
  {
    id: "5",
    name: "Team Chat",
    message: "John: Let's schedule the meeting for next week",
    timestamp: "2/25/25",
    unreadCount: 0,
    isOnline: false,
    status: "sent",
  },
  {
    id: "6",
    name: "Isabella Wilson",
    message: "Can you send me the address?",
    timestamp: "2/24/25",
    unreadCount: 0,
    isOnline: false,
    status: "failed",
  },
];

export default function useChatData() {
  const router = useRouter();
  const [chatItems, setChatItems] = useState<typeof SAMPLE_CHATS>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate fetching data - replace with your API call
    const timer = setTimeout(() => {
      setChatItems(SAMPLE_CHATS);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleChatPress = (id: string) => {
    const chat = chatItems.find((item) => item.id === id);

    router.push({
      pathname: `/chat/${id}`,
      params: {
        name: chat?.name,
      },
    });
  };

  return {
    chatItems,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleChatPress,
  };
}
