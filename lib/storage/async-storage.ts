import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAuthStorage } from "../auth/providers/types";

export class AsyncStorageAdapter implements IAuthStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("AsyncStorage getItem error:", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("AsyncStorage setItem error:", error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage removeItem error:", error);
      throw error;
    }
  }
}
