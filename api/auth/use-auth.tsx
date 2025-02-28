//use-auth.tsx

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "./auth.service";
import { useAuthStore } from "@/store/auth.store";
import { AuthCredentials } from "./auth.types";

export function useSignIn(authService: AuthService) {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      setLoading(true);
      try {
        return await authService.signIn(credentials);
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (result) => {
      if (result.kind === "success") {
        setSession(result.data);
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
  });
}

export function useSignOut(authService: AuthService) {
  const queryClient = useQueryClient();
  const reset = useAuthStore((state) => state.reset);
  const setLoading = useAuthStore((state) => state.setLoading);

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        return await authService.signOut();
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (result) => {
      if (result.kind === "success") {
        reset();
        queryClient.clear();
      }
    },
  });
}
