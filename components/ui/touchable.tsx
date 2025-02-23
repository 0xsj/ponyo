import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors, ThemeColors } from "@/constants/Colors";
import { Text } from "./text";

interface TouchableProps extends TouchableOpacityProps {
  flex?: number;
  row?: boolean;
  center?: boolean;
  middle?: boolean;
  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
  backgroundColor?: ThemeColors | string;
  borderRadius?: number;
  c?: ThemeColors | string; // Color shorthand for text
  size?: number; // Font size
  w?: "normal" | "bold" | "500" | "600" | "700"; // Font weight
  align?: "auto" | "left" | "right" | "center" | "justify"; // Text alignment
}

export const Touchable: React.FC<TouchableProps> = ({
  children,
  style,
  flex,
  row,
  center,
  middle,
  // Margin props
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  // Padding props
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  backgroundColor = "background",
  borderRadius,
  c,
  size,
  w,
  align,
  ...props
}) => {
  const themeBackgroundColor = useThemeColor(
    {
      light: Colors.light[backgroundColor as ThemeColors],
      dark: Colors.dark[backgroundColor as ThemeColors],
    },
    backgroundColor as ThemeColors,
  );

  const themeTextColor = useThemeColor(
    {
      light: Colors.light[c as ThemeColors],
      dark: Colors.dark[c as ThemeColors],
    },
    c as ThemeColors,
  );

  const touchableStyle = StyleSheet.flatten([
    flex !== undefined && { flex },
    row && styles.row,
    center && styles.center,
    middle && styles.middle,
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
    backgroundColor !== undefined && {
      backgroundColor:
        backgroundColor in Colors.light
          ? themeBackgroundColor
          : backgroundColor,
    },
    borderRadius !== undefined && { borderRadius },
    style,
  ]) as ViewStyle;

  const textStyle = StyleSheet.flatten([
    c !== undefined && { color: c in Colors.light ? themeTextColor : c },
    size !== undefined && { fontSize: size },
    w !== undefined && { fontWeight: w },
    align !== undefined && { textAlign: align },
  ]) as TextStyle;

  return (
    <TouchableOpacity style={touchableStyle} {...props}>
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  center: {
    alignItems: "center",
  },
  middle: {
    justifyContent: "center",
  },
});
