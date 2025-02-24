import { ColorValue, FlexStyle, DimensionValue } from "react-native";

export const theme = {
  colors: {
    light: {
      // foreground: "#18181b", // gray.900
      // background: "#ffffff",
      background: "#FFFFFF",
      foreground: "#000000",
      surface: "#f4f4f5", // gray.100
      surfaceHover: "#e4e4e7", // gray.200
      border: "#d4d4d8", // gray.300
      borderHover: "#a1a1aa", // gray.400
      muted: "#71717a", // gray.500
      primary: "#2563eb", // blue.600
      primaryHover: "#1d4ed8",
      success: "#16a34a", // green.600
      warning: "#ca8a04", // yellow.600
      error: "#dc2626", // red.600
      info: "#0891b2", // cyan.600
    },
    dark: {
      // foreground: "#f4f4f5", // gray.100
      // background: "#18181b", // gray.900
      background: "#000000",
      foreground: "#FFFFFF",
      surface: "#27272a", // gray.800
      surfaceHover: "#3f3f46", // gray.700
      border: "#52525b", // gray.600
      borderHover: "#71717a", // gray.500
      muted: "#a1a1aa", // gray.400
      primary: "#3b82f6", // blue.500
      primaryHover: "#60a5fa", // blue.400
      success: "#22c55e", // green.500
      warning: "#eab308", // yellow.500
      error: "#ef4444", // red.500
      info: "#06b6d4", // cyan.500
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 40,
    },
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
} as const;

export type ColorKeys = keyof ThemeColors;
export type ThemeColors = typeof theme.colors.light;
export type SpacingKeys = keyof typeof theme.spacing;
export type RadiiKeys = keyof typeof theme.radii;
export type FontSizeKeys = keyof typeof theme.typography.sizes;
export type FontWeightKeys = keyof typeof theme.typography.weights;

export interface StyleTokens {
  w?: DimensionValue;
  h?: DimensionValue;
  minW?: DimensionValue;
  maxW?: DimensionValue;
  minH?: DimensionValue;
  maxH?: DimensionValue;
  pos?: "relative" | "absolute";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  z?: number;
  m?: SpacingKeys | number;
  mt?: SpacingKeys | number;
  mr?: SpacingKeys | number;
  mb?: SpacingKeys | number;
  ml?: SpacingKeys | number;
  mx?: SpacingKeys | number;
  my?: SpacingKeys | number;
  p?: SpacingKeys | number;
  pt?: SpacingKeys | number;
  pr?: SpacingKeys | number;
  pb?: SpacingKeys | number;
  pl?: SpacingKeys | number;
  px?: SpacingKeys | number;
  py?: SpacingKeys | number;
  bg?: ColorKeys | string;
  borderRadius?: RadiiKeys | number;
  lightBg?: string;
  darkBg?: string;
}

export interface FlexboxTokens {
  flex?: number;
  flexDir?: FlexStyle["flexDirection"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  wrap?: FlexStyle["flexWrap"];
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: DimensionValue;
  alignSelf?: FlexStyle["alignSelf"];
}
export interface VisualTokens {
  opacity?: number;
  bg?: ColorValue;
  display?: "flex" | "none";
  borderRadius?: RadiiKeys | number;
}
