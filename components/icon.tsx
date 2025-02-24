import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { ColorKeys, StyleTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

const CUSTOM_ICONS = {
  google: {
    viewbox: "0 0 256 262",
    path: "",
    fill: "",
  },
  discord: {
    viewbox: "0 0 71 55",
    path: "",
    fill: "",
  },
  facebook: {
    viewbox: "",
    path: "",
    fill: "",
  },
};

export type IconSetType = "fontawesome" | "feather";
export type ButtonIcon = {
  name: string;
  iconSet: IconSetType;
};

interface IconTokens extends StyleTokens {
  size?: number;
  color?: ColorKeys;
}

export type IconProps = Omit<
  React.ComponentProps<typeof Feather>,
  "style" | "size" | "color" | "name"
> &
  IconTokens & {
    style?: StyleProp<ViewStyle>;
    name: FeatherNames | FontAwesomeNames;
    iconSet?: "feather" | "fontawesome";
  };

type FeatherNames = React.ComponentProps<typeof Feather>["name"];
type FontAwesomeNames = React.ComponentProps<typeof FontAwesome5>["name"];

export const Icon = React.forwardRef<any, IconProps>((props, ref) => {
  const {
    name,
    size = 24,
    color = "foreground",
    style,
    iconSet = "feather",
    ...rest
  } = props;
  const baseStyles = useStyleTokens({ ...rest, color }) as ViewStyle;

  if (iconSet === "fontawesome") {
    return (
      <FontAwesome5
        ref={ref}
        name={name as FontAwesomeNames}
        size={size}
        style={[baseStyles, style]}
        {...rest}
      />
    );
  }

  return (
    <Feather
      ref={ref}
      name={name as FeatherNames}
      size={size}
      style={[baseStyles, style]}
      {...rest}
    />
  );
});
