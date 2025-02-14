//session.ts

import type { AuthResult, AuthSession } from "./core";

export interface IAuthSession {
  getSession?(): Promise<AuthResult<AuthSession>>;
  refreshSession?(): Promise<AuthResult<AuthSession>>;
  isSessionValid?(): Promise<boolean>;
  onSessionExpired?(callback: () => void): () => void;
}
