const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // New semantic colors
    foreground: "#11181C", // Foreground color (e.g., text, icons)
    primary: "#0a7ea4", // Primary brand color
    secondary: "#FF6B6B", // Secondary brand color
    error: "#FF3B30", // Error state color
    success: "#34C759", // Success state color
    warning: "#FFCC00", // Warning state color
    border: "#D1D1D6", // Border color
    card: "#F5F5F5", // Background for cards or surfaces
    muted: "#687076", // Muted text or icons
  },
  dark: {
    // Existing colors
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // New semantic colors
    foreground: "#ECEDEE", // Foreground color (e.g., text, icons)
    primary: "#0a7ea4", // Primary brand color
    secondary: "#FF6B6B", // Secondary brand color
    error: "#FF453A", // Error state color
    success: "#30D158", // Success state color
    warning: "#FFD60A", // Warning state color
    border: "#3A3A3C", // Border color
    card: "#1C1C1E", // Background for cards or surfaces
    muted: "#9BA1A6", // Muted text or icons
  },
};

export type ThemeColors = keyof typeof Colors.light & keyof typeof Colors.dark;
