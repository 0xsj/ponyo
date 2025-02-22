// lib/providers/service-provider.tsx
import { createContext, useContext, PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/client/supabase-client";
import { AuthModule, createAuthModule } from "@/api/auth/auth.module";

interface Modules {
  auth: AuthModule;
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

  const modules: Modules = {
    auth: createAuthModule(supabase, queryClient),
  };

  return (
    <ModuleContext.Provider value={modules}>{children}</ModuleContext.Provider>
  );
}
