import { MMKV } from "react-native-mmkv";
import { StorageAdapter } from "./types";

const storage = new MMKV();

export const MMKVStorageAdapter: StorageAdapter = {
  getItem: async (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },

  setItem: async (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },

  removeItem: async (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
