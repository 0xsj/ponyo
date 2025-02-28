import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { theme } from "@/theme/theme";
import { Icon } from "@/components/icon";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors[colorScheme].primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            height: 70,
            paddingBottom: 10,
            backgroundColor: "background",
            borderTopWidth: 0,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color="foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarIcon: ({ color }) => (
            <Icon name="compass" size={24} color="foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarIcon: ({ color }) => (
            <Icon name="message-circle" size={24} color="foreground" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 10,
          },
          tabBarIcon: ({ color }) => {
            return <Icon name="user" size={24} color="foreground" />;
          },
        }}
      />
    </Tabs>
  );
}
