import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function TabTwoScreen() {
  return (
    <Box backgroundColor="background" flex={1} center middle>
      <Text c="foreground">Explore</Text>
    </Box>
  );
}
