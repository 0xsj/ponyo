import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const storage = new MMKV();

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },

  removeItem: (name) => {
    return storage.delete(name);
  },
};

export const storageHelper = {
  set: <T>(key: string, value: T) => {
    if (typeof value === "string") {
      storage.set(key, value);
    } else {
      storage.set(key, JSON.stringify(value));
    }
  },
  get: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },
  delete: (key: string) => {
    storage.delete(key);
  },
  clearAll: () => {
    storage.clearAll();
  },
};
