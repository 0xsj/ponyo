//auth.service

import { ServiceError } from "@/lib/errors/service-error";
import { IAuth } from "./auth.interface";
import { Result } from "@/lib/shared/result";
import {
  AuthCredentials,
  AuthUser,
  OAuthProvider,
  AuthEventPayload,
  AuthSession,
} from "./auth.entity";
import { AuthRepository } from "./auth.repository";

export class AuthService implements IAuth<ServiceError> {
  constructor(private readonly authRepository: AuthRepository) {}

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

  signUp(credentials: AuthCredentials): Promise<
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
  onAuthStateChange(callback: (payload: AuthEventPayload) => void): () => void {
    return this.authRepository.onAuthStateChange(callback);
  }
  
  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
