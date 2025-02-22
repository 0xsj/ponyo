// lib/module.base.ts
import { QueryClient } from "@tanstack/react-query";
import { TypedSupabaseClient } from "../supabase/client/supabase-client";

export interface BaseModule<R, S, Q> {
  repository: R;
  service: S;
  queries: Q;
}

export type ModuleFactory<T> = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient,
) => T;
