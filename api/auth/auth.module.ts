import { BaseModule, ModuleFactory } from "@/lib/core/base.module";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthQueries, createAuthQueries } from "./auth.queries";

export interface AuthModule
  extends BaseModule<AuthRepository, AuthService, AuthQueries> {}

export const createAuthModule: ModuleFactory<AuthModule> = (
  supabase,
  queryClient,
) => {
  const repository = new AuthRepository(supabase);
  const service = new AuthService(repository);
  const queries = createAuthQueries(service, queryClient);

  return {
    repository,
    service,
    queries,
  };
};
