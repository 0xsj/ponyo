import type {
  User as SupabaseUser,
  Session as SupabaseSession,
} from "@supabase/supabase-js";
import {
  AuthUser,
  AuthSession,
  authUserSchema,
  authSessionSchema,
} from "../domain/auth.entity";
import { Result } from "@/lib/shared/result";
import { ValidationError } from "@/lib/errors/validation-error";

export class AuthMapper {
  static toAuthUser(
    supabaseUser: SupabaseUser | null,
  ): Result<AuthUser | null, ValidationError> {
    if (!supabaseUser) {
      return Result.Ok(null);
    }

    const userData = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? "",
      emailVerified: supabaseUser.email_confirmed_at !== null,
      metadata: {
        providers:
          supabaseUser.identities?.map((identity) => identity.provider) ?? [],
        appMetadata: supabaseUser.app_metadata,
        createdAt: supabaseUser.created_at,
        updatedAt: supabaseUser.updated_at,
      },
    };

    const result = authUserSchema.safeParse(userData);
    if (!result.success) {
      return Result.Err(ValidationError.fromZod(result.error));
    }

    return Result.Ok(result.data);
  }

  static toAuthSession(
    supabaseSession: SupabaseSession | null,
  ): Result<AuthSession | null, ValidationError> {
    if (!supabaseSession) {
      return Result.Ok(null);
    }

    const userResult = this.toAuthUser(supabaseSession.user);
    if (userResult.isErr()) {
      return Result.Err(userResult.unwrapErr());
    }

    const sessionData = {
      user: userResult.unwrap(),
      accessToken: supabaseSession.access_token,
      refreshToken: supabaseSession.refresh_token,
      expiresAt: supabaseSession.expires_at ?? Date.now() + 3600,
    };

    const result = authSessionSchema.safeParse(sessionData);
    if (!result.success) {
      return Result.Err(
        ValidationError.invalidDataStructure("Invalid session data structure", {
          issues: result.error.issues,
        }),
      );
    }

    return Result.Ok(result.data);
  }
}
