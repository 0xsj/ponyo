import { createContext, useContext, PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client/supabase-client";
import { AuthModule, createAuthModule } from "@/api/auth/auth.module";
import { getAuthStore, useAuthStoreSync } from "@/store/auth.store";

interface Modules {
  auth: AuthModule;
}

const ModuleContext = createContext<Modules | null>(null);

export const useService = <T extends keyof Modules>(name: T): Modules[T] => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within ModulesProvider");
  }
  return context[name];
};

export function SeviceProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const modules: Modules = {
    auth: createAuthModule(supabase, queryClient),
  };

  const store = getAuthStore();
  useAuthStoreSync(store, modules.auth.queries);

  return (
    <ModuleContext.Provider value={modules}>{children}</ModuleContext.Provider>
  );
}
