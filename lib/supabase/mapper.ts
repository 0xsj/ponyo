import type {
  User as SupabaseUser,
  Session as SupabaseSession,
} from "@supabase/supabase-js";
import type { AuthUser, AuthSession } from "../core";

export class SupabaseMapper {
  static toAuthUser(supabaseUser: SupabaseUser | null): AuthUser | null {
    if (!supabaseUser) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? "",
      emailVerified: supabaseUser.email_confirmed_at !== null,
      metadata: supabaseUser.user_metadata,
    };
  }

  static toAuthSession(
    supabaseSession: SupabaseSession | null,
  ): AuthSession | null {
    if (!supabaseSession) return null;
    return {
      user: this.toAuthUser(supabaseSession.user),
      accessToken: supabaseSession.access_token,
      refreshToken: supabaseSession.refresh_token,
      expiresAt: supabaseSession.expires_at,
    };
  }
}
