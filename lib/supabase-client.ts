import { createClient } from "@supabase/supabase-js";
import { storageAdapter } from "./storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be defined in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function loadSession() {
  try {
    const session = await storageAdapter.getItem("supabase.auth.token");
    console.log("Session check:", session ? "Found" : "Not found");

    if (!session) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "example@gmail.com",
        password: "Test123$",
      });

      if (error) {
        console.error("Sign-in failed:", error.message);
      } else {
        console.log("Sign-in successful:", data);
      }
    }
  } catch (error) {
    console.error("Error loading session:", error);
  }
}
