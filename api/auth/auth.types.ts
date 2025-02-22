import { Database } from "@/lib/supabase";

export interface AuthQueryKeys {
  all: readonly ["auth"];
  session: readonly ["auth", "session"];
  user: readonly ["auth", "user"];
  status: readonly ["auth", "status"];
}

export const authKeys: AuthQueryKeys = {
  all: ["auth"],
  session: ["auth", "session"],
  user: ["auth", "user"],
  status: ["auth", "status"],
} as const;
