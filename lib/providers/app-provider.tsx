import { createAuthModule } from "@/api/auth/auth.module";
import {
  supabase,
  TypedSupabaseClient,
} from "../supabase/client/supabase-client";
import React, { createContext, PropsWithChildren, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const authModule = createAuthModule(supabase);

interface AppContext {
  auth: ReturnType<typeof createAuthModule>;
}

const ModuleContext = createContext<AppContext | null>(null);

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModules must be used within AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  const modules: AppContext = {
    auth: authModule,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ModuleContext.Provider value={modules}>
        {children}
      </ModuleContext.Provider>
    </QueryClientProvider>
  );
};
