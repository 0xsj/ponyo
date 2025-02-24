//auth.repository
import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { IAuth } from "../domain/auth.interface";
import {
  AuthCredentials,
  AuthEventPayload,
  AuthEventType,
  AuthSession,
  AuthUser,
  OAuthProvider,
} from "../domain/auth.entity";
import { RepositoryError } from "@/lib/errors/repository-error";
import { Result } from "@/lib/shared/result";
import { AuthMapper } from "./auth.mapper";
import { match, P } from "ts-pattern";
import { ValidationError } from "@/lib/errors/validation-error";

export class AuthRepository implements IAuth<RepositoryError> {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  private handleSessionResult(
    sessionResult: Result<AuthSession, ValidationError>,
    type: string,
  ): Result<AuthSession, RepositoryError> {
    if (sessionResult.isErr()) {
      return Result.Err(
        RepositoryError.validationFailed(`Failed to parse ${type} session`, {
          validation: sessionResult.unwrapErr(),
        }),
      );
    }
    return Result.Ok(sessionResult.unwrap());
  }

  async signIn(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, RepositoryError>> {
    try {
      const result = await match(credentials)
        .with(
          {
            identifier: P.string,
            secret: P.string,
          },
          async (creds) => {
            const { data, error } = await this.supabase.auth.signInWithPassword(
              {
                email: creds.identifier,
                password: creds.secret,
              },
            );
            return { data, error, type: "password" as const };
          },
        )
        .with(
          {
            oauth: {
              accessToken: P.string,
              provider: P.string,
            },
          },
          async (creds) => {
            const { data, error } = await this.supabase.auth.signInWithIdToken({
              provider: creds.oauth!.provider as any,
              token: creds.oauth!.accessToken,
            });
            return { data, error, type: "oauth" as const };
          },
        )
        .with(
          {
            identifier: P.string,
            mfa: {
              code: P.string,
            },
          },
          async (creds) => {
            const { data, error } = await this.supabase.auth.verifyOtp({
              email: creds.identifier,
              token: creds.mfa!.code!,
              type: "email",
            });
            return { data, error, type: "mfa" as const };
          },
        )
        .otherwise(() => ({
          data: null,
          error: { message: "Invalid authentication method" },
          type: "invalid" as const,
        }));

      if (result.error) {
        return Result.Err(
          RepositoryError.queryFailed(result.error.message, {
            type: result.type,
            details: result.error,
          }),
        );
      }

      const sessionResult = AuthMapper.toAuthSession(
        result.data?.session ?? null,
      );
      if (sessionResult.isErr()) {
        return Result.Err(
          RepositoryError.validationFailed(
            `Failed to parse ${result.type} session`,
            {
              validation: sessionResult.unwrapErr(),
            },
          ),
        );
      }

      const session = sessionResult.unwrap();
      if (!session) {
        return Result.Err(
          RepositoryError.invalidSession("Session data is null or invalid"),
        );
      }

      return Result.Ok(session);
    } catch (error) {
      return Result.Err(
        RepositoryError.connectionFailed("Sign in failed", { error }),
      );
    }
  }

  signUp(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  async signOut(): Promise<Result<void, RepositoryError>> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return Result.Err(
          RepositoryError.queryFailed("Failed to sign out", {
            details: error,
          }),
        );
      }

      return Result.Ok(void 0);
    } catch (error) {
      return Result.Err(
        RepositoryError.connectionFailed("Sign out failed", { error }),
      );
    }
  }

  getSession(): Promise<Result<AuthSession, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  refreshSession(): Promise<Result<AuthSession, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  isSessionValid(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUser(): Promise<Result<AuthUser, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  updateUser(
    data: Partial<AuthUser>,
  ): Promise<Result<AuthUser, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  signInWithProvider(
    provider: OAuthProvider,
  ): Promise<Result<AuthSession, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  resetPassword(identifier: string): Promise<Result<void, RepositoryError>> {
    throw new Error("Method not implemented.");
  }
  updatePassword(newSecret: string): Promise<Result<void, RepositoryError>> {
    throw new Error("Method not implemented.");
  }

  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
