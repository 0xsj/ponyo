import type { IAuthStorage } from "./storage";

export interface AuthConfig {
  storage?: IAuthStorage;
  autoRefreshToken?: boolean;
  persistSession?: boolean;
  detectSessionInUrl?: boolean;
  debug?: boolean;
}

export interface IAuthProviderFactory {
  createProvider(config: AuthConfig): Promise<any>;
}
