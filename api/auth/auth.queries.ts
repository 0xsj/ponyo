// auth.queries.ts
import { QueryClient } from "@tanstack/react-query";
import { IAuth, IAuthQueries } from "./auth.interface";
import {
  AuthCredentials,
  AuthEventPayload,
  AuthSession,
  AuthUser,
  OAuthProvider,
} from "./auth.entity";
import { QueryError } from "@/lib/errors/query-error";
import { Result } from "@/lib/shared/result";
import { ServiceError } from "@/lib/errors/service-error";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
} as const;

export class AuthQueries implements IAuthQueries {
  constructor(
    private readonly authService: IAuth<ServiceError>,
    private readonly queryClient: QueryClient,
  ) {}

  private updateAuthCache(session: AuthSession) {
    this.queryClient.setQueryData(authKeys.session(), session);
    this.queryClient.setQueryData(authKeys.user(), session.user);
  }

  async signIn(
    credentials: AuthCredentials,
  ): Promise<Result<AuthSession, ServiceError>> {
    const result = await this.authService.signIn(credentials);

    if (result.isOk()) {
      const session = result.unwrap();
      this.updateAuthCache(session);
      await this.queryClient.invalidateQueries({ queryKey: authKeys.all });
    }

    return result;
  }
  async signUp(credentials: AuthCredentials) {
    return this.authService.signUp(credentials);
  }

  async signOut(): Promise<Result<void, ServiceError>> {
    const result = await this.authService.signOut();

    if (result.isOk()) {
      this.queryClient.setQueryData(authKeys.session(), null);
      this.queryClient.setQueryData(authKeys.user(), null);
      await this.queryClient.invalidateQueries({ queryKey: authKeys.all });
    }

    return result;
  }

  async getSession() {
    return this.authService.getSession();
  }

  async refreshSession() {
    return this.authService.refreshSession();
  }

  async isSessionValid() {
    return this.authService.isSessionValid();
  }

  async getUser() {
    return this.authService.getUser();
  }

  async updateUser(data: Partial<AuthUser>) {
    return this.authService.updateUser(data);
  }

  async signInWithProvider(provider: OAuthProvider) {
    return this.authService.signInWithProvider(provider);
  }

  async resetPassword(identifier: string) {
    return this.authService.resetPassword(identifier);
  }

  async updatePassword(newSecret: string) {
    return this.authService.updatePassword(newSecret);
  }

  onAuthStateChange(callback: (payload: AuthEventPayload) => void) {
    return this.authService.onAuthStateChange(callback);
  }

  async initialize() {
    return this.authService.initialize();
  }

  async destroy() {
    return this.authService.destroy();
  }
}

export const createAuthQueries = (
  authService: IAuth<ServiceError>,
  queryClient: QueryClient,
) => new AuthQueries(authService, queryClient);
