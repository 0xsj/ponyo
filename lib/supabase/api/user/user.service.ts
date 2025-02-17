import { APIError } from "@/lib/errors/api-error";
import {
  RepositoryError,
  RepositoryErrorCode,
} from "@/lib/errors/repository-error";
import { UserAPI } from "./user.api";
import { Result } from "@/lib/shared/result";
import { User } from "@/lib/models";

export class UserService {
  constructor(private readonly userAPI: UserAPI) {}

  async getUserById(id: string): Promise<Result<User, APIError>> {
    const result = await this.userAPI.get(id);

    if (result.isErr()) {
      return Result.Err(this.toAPIError(result.unwrapErr()));
    }

    return Result.Ok(result.unwrap());
  }

  private toAPIError(error: RepositoryError): APIError {
    switch (error.code) {
      case RepositoryErrorCode.NotFound:
        return new APIError("User not found", "NOT_FOUND", 404);
      case RepositoryErrorCode.UniqueViolation:
        return new APIError("User already exists", "CONFLICT", 409);
      case RepositoryErrorCode.ConnectionError:
        return new APIError(
          "Database connection error",
          "SERVICE_UNAVAILABLE",
          503,
        );
      default:
        return new APIError(error.message, "INTERNAL_SERVER_ERROR", 500);
    }
  }
}
