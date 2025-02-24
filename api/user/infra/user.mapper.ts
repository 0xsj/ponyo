import { Result } from "@/lib/shared/result";
import { ValidationError } from "@/lib/errors/validation-error";
import {
  CreateUserDTO,
  DBUser,
  DBUserInsert,
  User,
  userSchema,
} from "../domain/user.entity";
import { transformToCamelCase, transformToSnakeCase } from "@/lib/shared/utils";

export class UserMapper {
  static toUser(data: Record<string, any>): Result<User, ValidationError> {
    const result = userSchema.safeParse(data);

    if (!result.success) {
      return Result.Err(ValidationError.fromZod(result.error));
    }

    return Result.Ok(result.data);
  }

  static toPersistence(user: CreateUserDTO): DBUserInsert {
    return transformToSnakeCase(user);
  }
}
