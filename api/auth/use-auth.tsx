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
