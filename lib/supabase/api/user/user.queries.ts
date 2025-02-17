import { useQuery } from "@tanstack/react-query";
import { UserService } from "./user.service";
import { APIError } from "@/lib/errors/api-error";
import { userKeys } from "./user.types";

export const useUserQuery = (id: string, userService: UserService) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const result = await userService.getUserById(id);
      if (result.isErr()) {
        throw result.unwrapErr();
      }
      return result.unwrap();
    },
    retry: (failureCount, error) => {
      if (error instanceof APIError && error.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
