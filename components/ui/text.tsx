import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
} from "react-native";
import { ColorKeys, StyleTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

interface TextTokens extends StyleTokens {
  size?: number;
  weight?: "400" | "500" | "600" | "700" | "bold";
  color?: ColorKeys;
  align?: "left" | "center" | "right" | "justify";
}

export type TextProps = Omit<RNTextProps, "style"> &
  TextTokens & {
    style?: StyleProp<TextStyle>;
  };

export const Text = React.forwardRef<RNText, TextProps>((props, ref) => {
  const { style, size, weight, color, align, ...rest } = props;
  const baseStyles = useStyleTokens({ ...rest, color }) as TextStyle;

  return (
    <RNText
      ref={ref}
      style={[
        baseStyles,
        size !== undefined && { fontSize: size },
        weight !== undefined && { fontWeight: weight },
        align !== undefined && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
});
