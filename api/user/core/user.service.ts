import { ServiceError } from "@/lib/errors/service-error";
import { Result } from "@/lib/shared/result";
import { CreateUserDTO, User } from "../domain/user.entity";
import { IUserRepository, IUserService } from "../domain/user.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
  create(date: CreateUserDTO): Promise<Result<User, ServiceError>> {
    throw new Error("Method not implemented.");
  }
  async getUser(id: string): Promise<Result<User | null, ServiceError>> {
    const result = await this.userRepository.getUser(id);
    if (result.isErr()) {
      return Result.Err(
        ServiceError.notFound("User not found", {
          cause: result.unwrapErr(),
        }),
      );
    }

    return Result.Ok(result.unwrap());
  }
}
