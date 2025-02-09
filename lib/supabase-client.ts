import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_SUPABASE_URL
const supbaseAnonKey = process.env.EXPO_SUPABASE_ANON_KEY

if (!supabaseUrl || !supbaseAnonKey) {
    throw new Error(
        "Supabase URL and anon key must be defined in .env"
    )
}


export const supabase = createClient(supabaseUrl, supbaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
})