import { createClient } from "@supabase/supabase-js";
import { MMKV } from "react-native-mmkv";

const supabaseUrl = process.env.EXPO_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_SUPABASE_ANON_KEY;

const storage = new MMKV();

const MMKVStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  getItem: (key: string) =>{
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  }
}


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be defined in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: MMKVStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
