import React from "react";
import { Text as RNText, TextStyle, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

type ThemeColorKeys = keyof typeof Colors.light;

interface TextProps extends React.ComponentProps<typeof RNText> {
  flex?: number;
  // Text styling
  c?: ThemeColorKeys | string;
  size?: number;
  w?: "normal" | "bold" | "500" | "600" | "700"; // weight shorthand
  align?: "auto" | "left" | "right" | "center" | "justify";
  // Margin shorthands
  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number;
  my?: number;
  // Padding shorthands
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  style,
  flex,
  // Text styling
  c,
  size,
  w,
  align,
  // Margins
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  // Paddings
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  ...props
}) => {
  // Check if `c` is a valid theme color key
  const isThemeColor = typeof c === "string" && c in Colors.light;

  // Use the theme color if `c` is a valid theme key, otherwise use the custom color or fallback to 'text'
  const color = useThemeColor(
    {
      light: Colors.light[c as ThemeColorKeys],
      dark: Colors.dark[c as ThemeColorKeys],
    },
    isThemeColor ? (c as ThemeColorKeys) : "text",
  );

  const textStyle = StyleSheet.flatten([
    styles.default,
    // Base styles
    flex !== undefined && { flex },
    // Text styles
    c !== undefined && { color: isThemeColor ? color : c }, // Use theme color or custom color
    size !== undefined && { fontSize: size },
    w !== undefined && { fontWeight: w },
    align !== undefined && { textAlign: align },
    // Margin styles
    m !== undefined && { margin: m },
    mt !== undefined && { marginTop: mt },
    mr !== undefined && { marginRight: mr },
    mb !== undefined && { marginBottom: mb },
    ml !== undefined && { marginLeft: ml },
    mx !== undefined && { marginHorizontal: mx },
    my !== undefined && { marginVertical: my },
    // Padding styles
    p !== undefined && { padding: p },
    pt !== undefined && { paddingTop: pt },
    pr !== undefined && { paddingRight: pr },
    pb !== undefined && { paddingBottom: pb },
    pl !== undefined && { paddingLeft: pl },
    px !== undefined && { paddingHorizontal: px },
    py !== undefined && { paddingVertical: py },
    style,
  ]) as TextStyle;

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: "#000000", // Default color
  },
});
