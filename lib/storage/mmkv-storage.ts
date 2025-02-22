import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export class MMKVStorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      const value = storage.getString(key);
      return value ?? null;
    } catch (error) {
      console.error("MMKV getItem error:", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error("MMKV setItem error:", error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      storage.delete(key);
    } catch (error) {
      console.error("MMKV removeItem error:", error);
      throw error;
    }
  }
}
