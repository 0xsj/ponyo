import { Platform } from "react-native";
import { AsyncStorageAdapter } from "./async-storage";
import { MMKVStorageAdapter } from "./mmkv-storage";

const isExpoGo = Platform.select({
  ios: process.env.EXPO_PUBLIC_APP_VARIANT === "development",
  android: process.env.EXPO_PUBLIC_APP_VARIANT === "development",
  default: false,
});

export const storageAdapter = isExpoGo
  ? new AsyncStorageAdapter()
  : new AsyncStorageAdapter();
