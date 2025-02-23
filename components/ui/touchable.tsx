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

export type TouchableProps = Omit<PressableProps, "style"> &
  TouchableTokens & {
    style?: StyleProp<ViewStyle>;
    pressableStyle?:
      | ((state: { pressed: boolean }) => StyleProp<ViewStyle>)
      | StyleProp<ViewStyle>;
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
            : pressableStyle,
          style,
        ]}
        {...rest}
      />
    );
  },
);
