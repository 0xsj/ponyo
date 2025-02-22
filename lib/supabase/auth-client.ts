import { Result } from "../shared/result";
import { supabase, TypedSupabaseClient } from "./client/supabase-client";
import { AuthSession } from "@/api/auth/domain/auth.entity";
import { AuthMapper } from "@/api/auth/infra/auth.mapper";

export interface IAuthClient {
  getSession(): Promise<Result<AuthSession | null, Error>>;
  subscribeToAuthChanges(
    callback: (session: AuthSession | null) => void,
  ): () => void;
}

export class SupabaseAuthClient implements IAuthClient {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  async getSession(): Promise<Result<AuthSession | null, Error>> {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      if (error) return Result.Err(error);

      return AuthMapper.toAuthSession(session);
    } catch (error) {
      return Result.Err(error as Error);
    }
  }

  subscribeToAuthChanges(
    callback: (session: AuthSession | null) => void,
  ): () => void {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange(async (_, session) => {
      const mappedSession = AuthMapper.toAuthSession(session).unwrapOr(null);
      callback(mappedSession);
    });

    return () => subscription.unsubscribe();
  }
}

export const authClient = new SupabaseAuthClient(supabase);
