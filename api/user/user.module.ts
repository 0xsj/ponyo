import { BaseModule, ModuleFactory } from "@/lib/core/base.module";
import { UserRepository } from "./infra/user.repository";
import { UserService } from "./core/user.service";
import { createUserQueries, UserQueries } from "./core/user.queries";

export interface UserModule
  extends BaseModule<UserRepository, UserService, UserQueries> {}

export const createUserModule: ModuleFactory<UserModule> = (
  supabase,
  queryClient,
) => {
  const repository = new UserRepository(supabase);
  const service = new UserService(repository);
  const queries = createUserQueries(service, queryClient);

  return {
    repository,
    service,
    queries,
  };
};
