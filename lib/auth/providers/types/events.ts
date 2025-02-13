//events.ts
import type { AuthSession, AuthUser, AuthError } from "./core";

export type AuthEventType =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "USER_UPDATED"
  | "TOKEN_REFRESHED"
  | "SESSION_EXPIRED";

export interface AuthEventPayload {
  type: AuthEventType;
  session?: AuthSession;
  user?: AuthUser;
  error?: AuthError;
}

export interface IAuthEvents {
  onAuthStateChange(callback: (payload: AuthEventPayload) => void): () => void;
}
