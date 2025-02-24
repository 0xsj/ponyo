import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  StyleProp,
} from "react-native";
import { ColorKeys, StyleTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

interface TextInputTokens extends StyleTokens {
  size?: number;
  weight?: "400" | "500" | "600" | "700" | "bold";
  color?: ColorKeys;
  placeholderColor?: ColorKeys;
}

export type TextInputProps = Omit<RNTextInputProps, "style"> &
  TextInputTokens & {
    style?: StyleProp<TextStyle>;
  };

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (props, ref) => {
    const { style, size, weight, color, placeholderColor, ...rest } = props;

    const baseStyles = useStyleTokens({ ...rest, color }) as TextStyle;
    const placeholderStyles = useStyleTokens({
      color: placeholderColor,
    }) as TextStyle;

    return (
      <RNTextInput
        ref={ref}
        placeholderTextColor={placeholderStyles.color}
        style={[
          baseStyles,
          size !== undefined && { fontSize: size },
          weight !== undefined && { fontWeight: weight },
          style,
        ]}
        {...rest}
      />
    );
  },
);
