import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  View,
} from "react-native";
import { StyleTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

interface TouchableTokens extends StyleTokens {}

interface PressableStyleState {
  pressed: boolean;
}

// Define a type for the pressable style object
interface PressableStyleObject {
  pressed?: StyleProp<ViewStyle>;
  default?: StyleProp<ViewStyle>;
}

export type TouchableProps = Omit<PressableProps, "style"> &
  TouchableTokens & {
    style?: StyleProp<ViewStyle>;
    pressableStyle?:
      | ((state: PressableStyleState) => StyleProp<ViewStyle>)
      | PressableStyleObject;
  };

export const Touchable = React.forwardRef<View, TouchableProps>(
  (props, ref) => {
    const { style, pressableStyle, ...rest } = props;
    const baseStyles = useStyleTokens(rest) as ViewStyle;

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          baseStyles,
          typeof pressableStyle === "function"
            ? pressableStyle({ pressed })
            : pressed
            ? pressableStyle?.pressed
            : pressableStyle?.default,
          style,
        ]}
        {...rest}
      />
    );
  }
);