import { ServiceError } from "@/lib/errors/service-error";
import { Result } from "@/lib/shared/result";
import { CreateUserDTO, User } from "../domain/user.entity";
import { IUserRepository, IUserService } from "../domain/user.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
  async create(data: CreateUserDTO): Promise<Result<User, ServiceError>> {
    const result = await this.userRepository.create(data);

    if (result.isErr()) {
      const repositoryError = result.unwrapErr();

      switch (repositoryError.kind) {
        case "unique_violation":
          return Result.Err(
            ServiceError.conflict("User with this email already exists", {
              cause: repositoryError,
            }),
          );
        case "validation_failed":
          return Result.Err(
            ServiceError.validationFailed("Invalid user data", {
              cause: repositoryError,
            }),
          );
        default:
          return Result.Err(
            ServiceError.unexpected("Unexpected error while creating user", {
              cause: repositoryError,
            }),
          );
      }
    }

    return Result.Ok(result.unwrap());
  }

  async getUser(id: string): Promise<Result<User | null, ServiceError>> {
    console.log(`UserService: Fetching user with ID ${id}`);

    const result = await this.userRepository.getUser(id);

    if (result.isErr()) {
      console.error("UserService: Error fetching user", result.unwrapErr());
      return Result.Err(
        ServiceError.notFound("User not found", {
          cause: result.unwrapErr(),
        }),
      );
    }

    console.log("UserService: Successfully fetched user data");
    return Result.Ok(result.unwrap());
  }
}
