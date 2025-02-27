//auth.repository.ts
import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { AuthSession, AuthCredentials } from "./auth.types";
import { DataResult, DataError } from "@/lib/core/result";

export class AuthRepository {
  private readonly supabase: TypedSupabaseClient;
  constructor(supabase: TypedSupabaseClient) {
    this.supabase = supabase;
  }

  async signIn(credentials: AuthCredentials): Promise<DataResult<AuthSession>> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.identifier,
      password: credentials.secret,
    });

    console.log(credentials);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return {
          kind: "error",
          error: DataError.invalid("Invalid email or password"),
        };
      }

      return {
        kind: "error",
        error: DataError.query("Authentication failed", { cause: error }),
      };
    }

    if (!data.session) {
      return {
        kind: "error",
        error: DataError.invalid("No session returned"),
      };
    }

    return {
      kind: "success",
      data: {
        user: {
          id: data.session?.user.id,
          email: data.session.user.email ?? "",
          email_confirmed_at: data.session.user.email_confirmed_at !== null,
        },
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
      },
    };
  }
}
