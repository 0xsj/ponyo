// auth.repository.ts
import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { AuthSession, AuthCredentials } from "./auth.types";
import { DataResult, DataError } from "@/lib/core/result";

export class AuthRepository {
  private readonly supabase: TypedSupabaseClient;

  constructor(supabase: TypedSupabaseClient) {
    this.supabase = supabase;
  }

  async signIn(credentials: AuthCredentials): Promise<DataResult<AuthSession>> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.identifier,
        password: credentials.secret,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return {
            kind: "error",
            error: DataError.invalid("Invalid email or password", {
              source: error,
            }),
          };
        }

        return {
          kind: "error",
          error: DataError.query("Authentication failed", {
            source: error,
          }),
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
            id: data.session.user.id,
            email: data.session.user.email ?? "",
            email_confirmed_at: data.session.user.email_confirmed_at !== null,
          },
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at ?? 0,
        },
      };
    } catch (error) {
      return {
        kind: "error",
        error: DataError.unexpected("Unexpected error during sign in", {
          source: error instanceof Error ? error : new Error(String(error)),
        }),
      };
    }
  }

  async signOut(): Promise<DataResult<void>> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return {
          kind: "error",
          error: DataError.query("Sign out failed", {
            source: error,
          }),
        };
      }

      return { kind: "success", data: void 0 };
    } catch (error) {
      return {
        kind: "error",
        error: DataError.unexpected("Unexpected error during sign out", {
          source: error instanceof Error ? error : new Error(String(error)),
        }),
      };
    }
  }
}
