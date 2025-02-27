import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

export interface AuthModule {
  repository: AuthRepository, 
  service: AuthService
}

export function createAuthModule(client: TypedSupabaseClient): AuthModule {
  const repository = new AuthRepository(client);
  const service = new AuthService(repository);
  return {
    repository,
    service
  };
}
