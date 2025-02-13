import { storageAdapter } from "./index";
import { StateStorage } from "zustand/middleware";

export const zustandStorage: StateStorage = {
  setItem: (name, value) => storageAdapter.setItem(name, value),
  getItem: (name) => storageAdapter.getItem(name),
  removeItem: (name) => storageAdapter.removeItem(name),
};

export const storageHelper = {
  set: async <T>(key: string, value: T) => {
    if (typeof value === "string") {
      await storageAdapter.setItem(key, value);
    } else {
      await storageAdapter.setItem(key, JSON.stringify(value));
    }
  },
  get: async <T>(key: string): Promise<T | null> => {
    const value = await storageAdapter.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },
  delete: (key: string) => storageAdapter.removeItem(key),
  // clearAll: async () => {
  // },
};
