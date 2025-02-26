// lib/providers/service-provider.tsx
import { createContext, useContext, PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client/supabase-client";
import { AuthModule, createAuthModule } from "@/api/auth/auth.module";
import { createUserModule, UserModule } from "@/api/user/user.module";
import { UserRepository } from "@/api/user/infra/user.repository";
import { AuthRepository } from "@/api/auth/infra/auth.repository";
import { UserService } from "@/api/user/core/user.service";
import { AuthService } from "@/api/auth/core/auth.service";
import { createAuthQueries } from "@/api/auth/core/auth.queries";
import { createUserQueries } from "@/api/user/core/user.queries";

interface Modules {
  auth: AuthModule;
  user: UserModule;
}

const ModuleContext = createContext<Modules | null>(null);

export const useService = <T extends keyof Modules>(name: T): Modules[T] => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useService must be used within ServiceProvider");
  }
  return context[name];
};

export function ServiceProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  // Create repositories
  const userRepository = new UserRepository(supabase);
  const authRepository = new AuthRepository(supabase);

  // Create user service first
  const userService = new UserService(userRepository);

  // Create auth service with user service dependency
  const authService = new AuthService(authRepository, userService);

  // Create queries
  const userQueries = createUserQueries(userService, queryClient);
  const authQueries = createAuthQueries(authService, queryClient);

  // Create modules
  const modules: Modules = {
    auth: {
      repository: authRepository,
      service: authService,
      queries: authQueries,
    },
    user: {
      repository: userRepository,
      service: userService,
      queries: userQueries,
    },
  };

  return (
    <ModuleContext.Provider value={modules}>{children}</ModuleContext.Provider>
  );
}
