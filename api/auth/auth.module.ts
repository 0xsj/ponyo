import { BaseModule, ModuleFactory } from "@/lib/core/base.module";
import { AuthRepository } from "./infra/auth.repository";
import { AuthService } from "./core/auth.service";
import { AuthQueries, createAuthQueries } from "./core/auth.queries";
import { UserService } from "../user/core/user.service";

export interface AuthModuleDeps {
  userService: UserService;
}

export interface AuthModule
  extends BaseModule<AuthRepository, AuthService, AuthQueries> {}

export const createAuthModule: ModuleFactory<AuthModule> = (
  supabase,
  queryClient,
  deps?: AuthModuleDeps,
) => {
  const repository = new AuthRepository(supabase);
  const service = new AuthService(repository, deps?.userService!);
  const queries = createAuthQueries(service, queryClient);

  return {
    repository,
    service,
    queries,
  };
};
