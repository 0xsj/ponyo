import React from "react";
import {
  SafeAreaView as RNSafeAreaView,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { StyleTokens, FlexboxTokens, VisualTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

export type SafeAreaViewProps = Omit<ViewProps, "style"> &
  StyleTokens &
  FlexboxTokens &
  VisualTokens & {
    style?: StyleProp<ViewStyle>;
  };

export const SafeAreaView = React.forwardRef<RNSafeAreaView, SafeAreaViewProps>(
  (props, ref) => {
    const { style, ...rest } = props;
    const baseStyles = useStyleTokens(rest);

    return <RNSafeAreaView ref={ref} style={[baseStyles, style]} {...rest} />;
  },
);
