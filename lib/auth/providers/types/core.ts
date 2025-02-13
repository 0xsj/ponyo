//core.ts

export interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  metadata?: Record<string, any>;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface AuthResult<T = any> {
  data: T | null;
  error: AuthError | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface IAuthCore {
  signIn(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
  signUp(credentials: AuthCredentials): Promise<AuthResult<AuthSession>>;
  signOut(): Promise<AuthResult<void>>;
}
