import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ColorKeys, StyleTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

interface IconTokens extends StyleTokens {
  size?: number;
  color?: ColorKeys;
}

export type IconProps = Omit<
  React.ComponentProps<typeof Feather>,
  "style" | "size" | "color"
> &
  IconTokens & {
    style?: StyleProp<ViewStyle>;
  };

export const Icon = React.forwardRef<any, IconProps>((props, ref) => {
  const { name, size = 24, color = "foreground", style, ...rest } = props;

  const baseStyles = useStyleTokens({ ...rest, color }) as ViewStyle;

  return (
    <Feather
      ref={ref}
      name={name}
      size={size}
      style={[baseStyles, style]}
      {...rest}
    />
  );
});
