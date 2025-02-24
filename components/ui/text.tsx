import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
} from "react-native";
import {
  ColorKeys,
  StyleTokens,
  FontSizeKeys,
  FontWeightKeys,
  theme,
} from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

interface TextTokens extends StyleTokens {
  fontSize?: FontSizeKeys;
  fontWeight?: FontWeightKeys;
  color?: ColorKeys;
  align?: "left" | "center" | "right" | "justify";
}

export type TextProps = Omit<RNTextProps, "style"> &
  TextTokens & {
    style?: StyleProp<TextStyle>;
  };

export const Text = React.forwardRef<RNText, TextProps>((props, ref) => {
  const { style, fontSize, fontWeight, color, align, ...rest } = props;
  const baseStyles = useStyleTokens({ ...rest, color }) as TextStyle;

  return (
    <RNText
      ref={ref}
      style={[
        baseStyles,
        fontSize !== undefined && {
          fontSize: theme.typography.sizes[fontSize],
        },
        fontWeight !== undefined && {
          fontWeight: theme.typography.weights[fontWeight],
        },
        align !== undefined && { textAlign: align },
        style,
      ]}
      {...rest}
    />
  );
});
