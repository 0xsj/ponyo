//auth.repository
import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { IAuth } from "../domain/auth.interface";
import {
  AuthCredentials,
  AuthEventPayload,
  AuthEventType,
  AuthSession,
  AuthUser,
  EmailVerificationSubmit,
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
    sessionResult: Result<AuthSession | null, ValidationError>,
    type: string,
  ): Result<AuthSession, RepositoryError> {
    if (sessionResult.isErr()) {
      return Result.Err(
        RepositoryError.validationFailed(`Failed to parse ${type} session`, {
          validation: sessionResult.unwrapErr(),
        }),
      );
    }

    const session = sessionResult.unwrap();
    if (!session) {
      return Result.Err(
        RepositoryError.invalidSession(`${type} session is null`),
      );
    }

    return Result.Ok(session);
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

  async signUp(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, RepositoryError>> {
    try {
      console.log("Starting signUp with:", { email: credentials.identifier });

      if (!credentials.identifier || !credentials.secret) {
        return Result.Err(
          RepositoryError.validationFailed(
            "Email and password are required for signup",
          ),
        );
      }

      // Sign up with Supabase - the email should already be verified at this point
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.identifier,
        password: credentials.secret,
        options: {
          emailRedirectTo: undefined,
        },
      });

      console.log("Supabase signUp response:", {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error ? error.message : null,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          console.log("User already registered, attempting sign in");

          const signInResult = await this.signIn({
            identifier: credentials.identifier,
            secret: credentials.secret,
          });

          if (signInResult.isErr()) {
            console.error("Sign in attempt failed:", signInResult.unwrapErr());
            return Result.Err(RepositoryError.uniqueViolation("User", "email"));
          }

          return signInResult;
        }

        return Result.Err(
          RepositoryError.queryFailed("Signup failed: " + error.message, {
            details: error,
          }),
        );
      }

      if (!data.session) {
        console.error("No session returned after signup");
        return Result.Err(
          RepositoryError.invalidSession("No session returned after signup"),
        );
      }

      const sessionResult = AuthMapper.toAuthSession(data.session);
      if (sessionResult.isErr()) {
        return Result.Err(
          RepositoryError.validationFailed("Failed to parse session", {
            validation: sessionResult.unwrapErr(),
          }),
        );
      }

      const session = sessionResult.unwrap();
      if (!session) {
        return Result.Err(
          RepositoryError.validationFailed("Session mapping returned null"),
        );
      }

      return Result.Ok(session);
    } catch (error) {
      console.error("Unexpected error in signUp:", error);
      return Result.Err(
        RepositoryError.connectionFailed(
          "Signup failed due to unexpected error",
          { error },
        ),
      );
    }
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

  async requestEmailVerification(
    email: string,
  ): Promise<Result<void, RepositoryError>> {
    try {
      console.log("Requesting email verification for local instance:", email);

      // For local development, we'll use a different approach
      // Sign up directly with a magic link instead of OTP
      const { data, error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: "http://localhost:8081", // Adjust to your Expo app URL
        },
      });

      console.log("Magic link request response:", {
        hasData: !!data,
        hasError: !!error,
        errorDetails: error ? error.message : null,
      });

      if (error) {
        console.error("Error details from Supabase:", error);
        return Result.Err(
          RepositoryError.queryFailed("Failed to send verification link", {
            details: error,
          }),
        );
      }

      console.log("Verification link sent successfully");
      return Result.Ok(void 0);
    } catch (error) {
      console.error("Exception in requestEmailVerification:", error);

      return Result.Err(
        RepositoryError.connectionFailed("Verification request failed", {
          error,
        }),
      );
    }
  }

  async verifyEmail(
    data: EmailVerificationSubmit,
  ): Promise<Result<AuthSession, RepositoryError>> {
    try {
      console.log("Verifying email with code:", {
        email: data.email,
        codeLength: data.code.length,
      });

      const { data: authData, error } = await this.supabase.auth.verifyOtp({
        email: data.email,
        token: data.code,
        type: "email",
      });

      if (error) {
        return Result.Err(
          RepositoryError.queryFailed(
            "No session returned after verification",
            {
              details: error,
            },
          ),
        );
      }

      if (!authData.session) {
        console.error("No session returned after verification");
        return Result.Err(
          RepositoryError.queryFailed("No session returned after verification"),
        );
      }

      const sessionResult = AuthMapper.toAuthSession(authData.session);

      if (sessionResult.isOk() && sessionResult.unwrap() === null) {
        return Result.Err(
          RepositoryError.invalidSession("Email verification session is null"),
        );
      }

      return this.handleSessionResult(
        sessionResult as Result<AuthSession, ValidationError>,
        "email verification",
      );
    } catch (error) {
      return Result.Err(
        RepositoryError.connectionFailed("Email verification failed", {
          error,
        }),
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
