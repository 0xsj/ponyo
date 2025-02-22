import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

interface BoxProps extends React.ComponentProps<typeof View> {
  flex?: number;
  row?: boolean;
  center?: boolean;
  middle?: boolean;
  // Margin props
  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number;
  my?: number;
  // Padding props
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export const Box: React.FC<BoxProps> = ({
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
  backgroundColor,
  borderRadius,
  ...props
}) => {
  const boxStyle = StyleSheet.flatten([
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
    backgroundColor !== undefined && { backgroundColor },
    borderRadius !== undefined && { borderRadius },
    style,
  ]) as ViewStyle;

  return (
    <View style={boxStyle} {...props}>
      {children}
    </View>
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
