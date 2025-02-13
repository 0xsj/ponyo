import { Platform } from "react-native";
import { AsyncStorageAdapter } from "./async-storage";
import { MMKVStorageAdapter } from "./mmkv-storage";
import { IAuthStorage } from "../auth/providers/types";

const isExpoGo = Platform.select({
  ios: process.env.EXPO_PUBLIC_APP_VARIANT === "development",
  android: process.env.EXPO_PUBLIC_APP_VARIANT === "development",
  default: false,
});

export const storageAdapter: IAuthStorage = isExpoGo
  ? new AsyncStorageAdapter()
  : new AsyncStorageAdapter();
