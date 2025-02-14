import type { AuthUser, AuthResult, AuthSession } from "./core";
import type { IAuthCore } from "./core";
import type { IAuthSession } from "./session";
import type { IAuthOAuth } from "./oauth";
import type { IAuthEvents } from "./events";

export interface IAuthProvider
  extends IAuthCore,
    IAuthSession,
    // IAuthOAuth,
    IAuthEvents {
  initialize(): Promise<void>;

  getUser(): Promise<AuthResult<AuthUser>>;
  updateUser(data: Partial<AuthUser>): Promise<AuthResult<AuthUser>>;

  resetPassword(email: string): Promise<AuthResult<void>>;
  updatePassword(newPassword: string): Promise<AuthResult<void>>;

  sendVerificationEmail?(email: string): Promise<AuthResult<void>>;
  verifyEmail?(token: string): Promise<AuthResult<void>>;

  setupMFA?(): Promise<AuthResult<void>>;
  verifyMFA?(code: string): Promise<AuthResult<void>>;

  destroy(): Promise<void>;
}
