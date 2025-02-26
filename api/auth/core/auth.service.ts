//auth.service

import { ServiceError } from "@/lib/errors/service-error";
import { IAuth } from "../domain/auth.interface";
import { Result } from "@/lib/shared/result";
import {
  AuthCredentials,
  AuthUser,
  OAuthProvider,
  AuthEventPayload,
  AuthSession,
  EmailVerificationSubmit,
} from "../domain/auth.entity";
import { AuthRepository } from "../infra/auth.repository";
import { UserService } from "@/api/user/core/user.service";

export class AuthService implements IAuth<ServiceError> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async requestEmailVerification(
    email: string,
  ): Promise<Result<void, ServiceError>> {
    console.log("AuthService: Requesting email verification for:", email);

    const result = await this.authRepository.requestEmailVerification(email);

    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error("AuthService: Email verification request failed:", error);

      return Result.Err(
        ServiceError.unexpected("Failed to send verification code", {
          cause: error,
        }),
      );
    }

    console.log("AuthService: Email verification request successful");
    return Result.Ok(void 0);
  }

  async verifyEmail(
    data: EmailVerificationSubmit,
  ): Promise<Result<AuthSession, ServiceError>> {
    console.log("AuthService: Verifying email:", data.email);

    const result = await this.authRepository.verifyEmail(data);

    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error("AuthService: Email verification failed:", error);

      if (error.kind === "validation_failed") {
        return Result.Err(
          ServiceError.validationFailed("Invalid verification code", {
            cause: error,
          }),
        );
      }

      return Result.Err(
        ServiceError.unexpected("Failed to verify email", {
          cause: error,
        }),
      );
    }

    const session = result.unwrap();
    console.log("AuthService: Email verified successfully, session created");

    if (session && session.user) {
      try {
        console.log("Creating custom user record for:", session.user.id);

        const createUserResult = await this.userService.create({
          id: session.user.id,
          email: session.user.email,
          username: session.user.email.split("@")[0],
          account_status: "active",
          email_verified: true,
          is_active: true,
          is_deleted: false,
        });

        if (createUserResult.isErr()) {
          const error = createUserResult.unwrapErr();
          console.error("Failed to create custom user record:", error);

          if (
            error.message.includes("already exists") ||
            error.code === "CONFLICT" ||
            error.kind === "conflict"
          ) {
            console.log("Custom user already exists, no need to create");
          }
        } else {
          console.log("Custom user record created successfully");
        }
      } catch (error) {
        console.error("Unexpected error creating custom user record:", error);
      }
    }

    return Result.Ok(session);
  }

  async signIn(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, ServiceError>> {
    const result = await this.authRepository.signIn(credentials);
    if (result.isErr()) {
      return Result.Err(
        ServiceError.validationFailed("Authentication failed", {
          cause: result.unwrapErr(),
        }),
      );
    }
    return Result.Ok(result.unwrap());
  }

  async signUp(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, ServiceError>> {
    console.log("AuthService: Signing up user:", credentials.identifier);

    const result = await this.authRepository.signUp(credentials);

    if (result.isErr()) {
      const error = result.unwrapErr();
      console.error("AuthService: Sign up failed:", error);

      if (error.kind === "unique_violation") {
        return Result.Err(
          ServiceError.validationFailed("Email already registered", {
            cause: error,
          }),
        );
      }

      return Result.Err(
        ServiceError.unexpected("Failed to create account", {
          cause: error,
        }),
      );
    }

    const session = result.unwrap();
    console.log(
      "AuthService: User signed up successfully, creating user record",
    );

    if (session && session.user) {
      try {
        const createUserResult = await this.userService.create({
          id: session.user.id,
          email: session.user.email,
          username: session.user.email.split("@")[0],
          account_status: "active",
          email_verified: true,
          is_active: true,
          is_deleted: false,
        });

        if (createUserResult.isErr()) {
          const error = createUserResult.unwrapErr();
          console.error("AuthService: Failed to create user record:", error);

          if (
            error.message.includes("already exists") ||
            error.code === "CONFLICT" ||
            error.kind === "conflict"
          ) {
            console.log("AuthService: User already exists, would update here");
          }
        } else {
          console.log("AuthService: User record created successfully");
        }
      } catch (error) {
        console.error(
          "AuthService: Unexpected error creating user record:",
          error,
        );
      }
    }

    return Result.Ok(session);
  }

  async signOut(): Promise<Result<void, ServiceError>> {
    const result = await this.authRepository.signOut();

    if (result.isErr()) {
      return Result.Err(
        ServiceError.unexpected("Failed to sign out", {
          cause: result.unwrapErr(),
        }),
      );
    }

    return Result.Ok(void 0);
  }

  getSession(): Promise<
    Result<
      {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          emailVerified: boolean;
          metadata?:
            | {
                providers: string[];
                appMetadata: Record<string, unknown>;
                createdAt: string;
                updatedAt: string;
              }
            | undefined;
        };
        expiresAt: number;
      },
      ServiceError
    >
  > {
    throw new Error("Method not implemented.");
  }
  refreshSession(): Promise<
    Result<
      {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          emailVerified: boolean;
          metadata?:
            | {
                providers: string[];
                appMetadata: Record<string, unknown>;
                createdAt: string;
                updatedAt: string;
              }
            | undefined;
        };
        expiresAt: number;
      },
      ServiceError
    >
  > {
    throw new Error("Method not implemented.");
  }
  isSessionValid(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUser(): Promise<
    Result<
      {
        id: string;
        email: string;
        emailVerified: boolean;
        metadata?:
          | {
              providers: string[];
              appMetadata: Record<string, unknown>;
              createdAt: string;
              updatedAt: string;
            }
          | undefined;
      },
      ServiceError
    >
  > {
    throw new Error("Method not implemented.");
  }
  updateUser(data: Partial<AuthUser>): Promise<
    Result<
      {
        id: string;
        email: string;
        emailVerified: boolean;
        metadata?:
          | {
              providers: string[];
              appMetadata: Record<string, unknown>;
              createdAt: string;
              updatedAt: string;
            }
          | undefined;
      },
      ServiceError
    >
  > {
    throw new Error("Method not implemented.");
  }
  signInWithProvider(provider: OAuthProvider): Promise<
    Result<
      {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          emailVerified: boolean;
          metadata?:
            | {
                providers: string[];
                appMetadata: Record<string, unknown>;
                createdAt: string;
                updatedAt: string;
              }
            | undefined;
        };
        expiresAt: number;
      },
      ServiceError
    >
  > {
    throw new Error("Method not implemented.");
  }
  resetPassword(identifier: string): Promise<Result<void, ServiceError>> {
    throw new Error("Method not implemented.");
  }
  updatePassword(newSecret: string): Promise<Result<void, ServiceError>> {
    throw new Error("Method not implemented.");
  }

  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
