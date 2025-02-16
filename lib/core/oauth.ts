//oauth.ts
import type { AuthResult, AuthSession } from "./core";

export type OAuthProvider =
  | "google"
  | "apple"
  | "facebook"
  | "github"
  | "twitter";

export interface OAuthCredentials {
  provider: OAuthProvider;
  token?: string;
  scopes?: string[];
}

export interface IAuthOAuth {
  signInWithProvider?(
    provider: OAuthProvider,
  ): Promise<AuthResult<AuthSession>>;
  linkProvider?(provider: OAuthProvider): Promise<AuthResult<void>>;
  unlinkProvider?(provider: OAuthProvider): Promise<AuthResult<void>>;
  getLinkedProviders?(): Promise<AuthResult<OAuthProvider[]>>;
}
