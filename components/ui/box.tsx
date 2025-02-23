import React from "react";
import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { StyleTokens, FlexboxTokens, VisualTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

export type BoxProps = Omit<ViewProps, "style"> &
  StyleTokens &
  FlexboxTokens &
  VisualTokens & {
    style?: StyleProp<ViewStyle>;
  };

export const Box = React.forwardRef<View, BoxProps>((props, ref) => {
  const { style, ...rest } = props;
  const baseStyles = useStyleTokens(rest);
  return <View ref={ref} style={[baseStyles, style]} {...rest} />;
});
