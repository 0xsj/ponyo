import React from "react";
import {
  ScrollView as NativeScrollView,
  ScrollViewProps as NativeScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { StyleTokens, FlexboxTokens, VisualTokens } from "@/theme/theme";
import { useStyleTokens } from "@/theme/utils";

export type ScrollViewProps = Omit<NativeScrollViewProps, "style"> &
  StyleTokens &
  FlexboxTokens &
  VisualTokens & {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
  };

export const ScrollView = React.forwardRef<NativeScrollView, ScrollViewProps>(
  (props, ref) => {
    const { style, contentContainerStyle, ...rest } = props;

    const baseStyles = useStyleTokens(rest);

    return (
      <NativeScrollView
        ref={ref}
        style={[baseStyles, style]}
        contentContainerStyle={contentContainerStyle}
        {...rest}
      />
    );
  },
);
