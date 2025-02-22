//auth.interface.ts
import { Result } from "@/lib/shared/result";
import { ServiceError } from "@/lib/errors/service-error";
import { RepositoryError } from "@/lib/errors/repository-error";
import {
  AuthCredentials,
  AuthEventPayload,
  AuthSession,
  AuthUser,
  OAuthProvider,
} from "./auth.entity";
import { QueryError } from "@/lib/errors/query-error";

export interface IAuth<E extends Error> {
  // Core auth flows
  signIn(credentials: AuthCredentials): Promise<Result<AuthSession, E>>;
  signUp(credentials: AuthCredentials): Promise<Result<AuthSession, E>>;
  signOut(): Promise<Result<void, E>>;

  // Session management
  getSession(): Promise<Result<AuthSession, E>>;
  refreshSession(): Promise<Result<AuthSession, E>>;
  isSessionValid(): Promise<boolean>;

  // User management
  getUser(): Promise<Result<AuthUser, E>>;
  updateUser(data: Partial<AuthUser>): Promise<Result<AuthUser, E>>;

  // OAuth
  signInWithProvider(provider: OAuthProvider): Promise<Result<AuthSession, E>>;

  // Password management
  resetPassword(identifier: string): Promise<Result<void, E>>;
  updatePassword(newSecret: string): Promise<Result<void, E>>;

  // Event handling
  // onAuthStateChange(callback: (payload: AuthEventPayload) => void): () => void;

  // Lifecycle
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

// Repository implementation
export interface IAuthRepository extends IAuth<RepositoryError> {}

// Service implementation
export interface IAuthService extends IAuth<ServiceError> {}
