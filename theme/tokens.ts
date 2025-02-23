import { ColorValue, FlexStyle } from "react-native";

export interface LayoutTokens {
  w?: number | string;
  h?: number | string;
  minW?: number | string;
  maxW?: number | string;
  minH?: number | string;
  maxH?: number | string;
  pos?: "relative" | "absolute";
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  z?: number;
}
export interface SpacingTokens {
  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
}
export interface FlexboxTokens {
  flex?: number;
  flexDir?: FlexStyle["flexDirection"];
  align?: FlexStyle["alignItems"];
  justify?: FlexStyle["justifyContent"];
  wrap?: FlexStyle["flexWrap"];
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  alignSelf?: FlexStyle["alignSelf"];
}
export interface VisualTokens {
  opacity?: number;
  bg?: ColorValue;
  display?: "flex" | "none";
  borderRadius?: number;
}
export type StyleTokens = LayoutTokens &
  SpacingTokens &
  FlexboxTokens &
  VisualTokens;
