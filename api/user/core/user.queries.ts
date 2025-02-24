import { QueryClient } from "@tanstack/react-query";
import { IUserService } from "../domain/user.interface";
import { CreateUserDTO, User } from "../domain/user.entity";
import { Result } from "@/lib/shared/result";
import { ServiceError } from "@/lib/errors/service-error";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

export class UserQueries {
  constructor(
    private readonly userService: IUserService,
    private readonly queryClient: QueryClient,
  ) {}

  private updateUserCache(user: User) {
    this.queryClient.setQueryData(userKeys.detail(user.id), user);
  }

  async getUser(id: string): Promise<Result<User | null, ServiceError>> {
    const result = await this.userService.getUser(id);
    if (result.isOk()) {
      const user = result.unwrap();
      if (user) {
        this.updateUserCache(user);
      }
    }
    return result;
  }
}

export const createUserQueries = (
  userService: IUserService,
  queryClient: QueryClient,
) => new UserQueries(userService, queryClient);
