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
      if (!credentials.identifier || !credentials.secret) {
        console.error("AuthRepository: Missing required credentials for sign in");
        return Result.Err(
          RepositoryError.validationFailed("Email and password are required")
        );
      }
      
      console.log("AuthRepository: Attempting password sign in for:", credentials.identifier);
      
      const normalizedEmail = credentials.identifier.trim().toLowerCase();
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: credentials.secret,
      });

      console.log("Supabase sign-in raw response:", {
        data: JSON.stringify(data),
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error.details,
          // Log any other fields available on the error
        } : null
      });
      
      console.log("AuthRepository: Sign in response:", {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        errorMessage: error ? error.message : null
      });
      
      // Handle errors
      if (error) {
        console.error("AuthRepository: Sign in failed:", error.message);
        
        if (error.message.includes("Invalid login credentials")) {
          return Result.Err(
            RepositoryError.queryFailed("Invalid email or password", {
              details: error,
            })
          );
        }
        
        if (error.message.includes("Email not confirmed")) {
          return Result.Err(
            RepositoryError.queryFailed("Email not verified", {
              details: error,
            })
          );
        }
        
        return Result.Err(
          RepositoryError.queryFailed(`Sign in failed: ${error.message}`, {
            details: error,
          })
        );
      }
      
      // Ensure we have a session
      if (!data.session) {
        console.error("AuthRepository: Sign in succeeded but no session returned");
        return Result.Err(
          RepositoryError.invalidSession("No session returned after sign in")
        );
      }
      
      console.log("AuthRepository: Sign in successful", {
        userId: data.session.user.id,
        email: data.session.user.email
      });
      
      // Map the session to our domain model
      const sessionResult = AuthMapper.toAuthSession(data.session);
      
      if (sessionResult.isErr()) {
        console.error("AuthRepository: Session mapping failed:", sessionResult.unwrapErr());
        return Result.Err(
          RepositoryError.validationFailed("Failed to parse session", {
            validation: sessionResult.unwrapErr(),
          })
        );
      }
      
      const session = sessionResult.unwrap();
      if (!session) {
        console.error("AuthRepository: Session mapping returned null");
        return Result.Err(
          RepositoryError.invalidSession("Session mapping returned null")
        );
      }
      
      console.log("AuthRepository: Session mapped successfully");
      return Result.Ok(session);
    } catch (error) {
      console.error("AuthRepository: Unexpected error during sign in:", error);
      return Result.Err(
        RepositoryError.connectionFailed("Sign in failed due to an unexpected error", { 
          error 
        })
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

      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.identifier,
        password: credentials.secret,
        options: {
          emailRedirectTo: undefined,
        },
      });

      console.log('secret is:    ', credentials.secret),

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

  async getSession(): Promise<Result<AuthSession, RepositoryError>> {
    try {
      console.log("AuthRepository: Retrieving current session");
      
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        console.error("AuthRepository: Error getting session:", error.message);
        return Result.Err(
          RepositoryError.queryFailed("Failed to get session", {
            details: error,
          }),
        );
      }
      
      if (!data.session) {
        console.log("AuthRepository: No active session found");
        return Result.Err(
          RepositoryError.invalidSession("No active session found"),
        );
      }
      
      const sessionResult = AuthMapper.toAuthSession(data.session);
      
      console.log("AuthRepository: Session retrieved successfully", {
        sessionExists: !!data.session,
        mappingSuccessful: sessionResult.isOk(),
      });
      
      return this.handleSessionResult(
        sessionResult as Result<AuthSession, ValidationError>,
        "current",
      );
    } catch (error) {
      console.error("AuthRepository: Unexpected error getting session:", error);
      return Result.Err(
        RepositoryError.connectionFailed("Failed to get session", { error }),
      );
    }
  }
  async refreshSession(): Promise<Result<AuthSession, RepositoryError>> {
    try {
      console.log("AuthRepository: Refreshing session");
      
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) {
        console.error("AuthRepository: Error refreshing session:", error.message);
        return Result.Err(
          RepositoryError.queryFailed("Failed to refresh session", {
            details: error,
          }),
        );
      }
      
      if (!data.session) {
        console.log("AuthRepository: No session returned after refresh");
        return Result.Err(
          RepositoryError.invalidSession("No session returned after refresh"),
        );
      }
      
      const sessionResult = AuthMapper.toAuthSession(data.session);
      
      console.log("AuthRepository: Session refreshed successfully", {
        hasNewSession: !!data.session,
        mappingSuccessful: sessionResult.isOk(),
      });
      
      return this.handleSessionResult(
        sessionResult as Result<AuthSession, ValidationError>,
        "refreshed",
      );
    } catch (error) {
      console.error("AuthRepository: Unexpected error refreshing session:", error);
      return Result.Err(
        RepositoryError.connectionFailed("Failed to refresh session", { error }),
      );
    }
  }

  async isSessionValid(): Promise<boolean> {
    try {
      console.log("AuthRepository: Checking session validity");
      
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        console.error("AuthRepository: Error checking session validity:", error.message);
        return false;
      }
      
      const isValid = !!data.session && 
                      !!data.session.access_token && 
                      !!data.session.user;
      
      console.log("AuthRepository: Session validity check result:", {
        hasSession: !!data.session,
        hasAccessToken: !!data.session?.access_token,
        hasUser: !!data.session?.user,
        isValid,
      });
      
      return isValid;
    } catch (error) {
      console.error("AuthRepository: Unexpected error checking session validity:", error);
      return false;
    }
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
