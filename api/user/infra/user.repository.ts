import { TypedSupabaseClient } from "@/lib/supabase/client/supabase-client";
import { IUserRepository } from "../domain/user.interface";
import { User, CreateUserDTO } from "../domain/user.entity";
import { RepositoryError } from "@/lib/errors/repository-error";
import { Result } from "@/lib/shared/result";
import { UserMapper } from "./user.mapper";

export class UserRepository implements IUserRepository {
  constructor(private readonly supabase: TypedSupabaseClient) {}
  async create(data: CreateUserDTO): Promise<Result<User, RepositoryError>> {
    const dbData = UserMapper.toPersistence(data);

    const { data: user, error } = await this.supabase
      .from("users")
      .insert(dbData)
      .select()
      .single();

    if (error?.code === "23505") {
      return Result.Err(RepositoryError.uniqueViolation("User", "email"));
    }

    if (error) {
      return Result.Err(RepositoryError.queryFailed(error.message));
    }

    if (!user) {
      return Result.Err(RepositoryError.queryFailed("Failed to create user"));
    }

    return UserMapper.toUser(user).mapErr((validationError) =>
      RepositoryError.validationFailed(validationError.message, {
        validation: validationError,
      }),
    );
  }
  async getUser(id: string): Promise<Result<User, RepositoryError>> {
    const { data: user, error } = await this.supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return Result.Err(RepositoryError.recordNotFound("User", id));
      }
      return Result.Err(RepositoryError.queryFailed(error.message));
    }

    if (!user) {
      return Result.Err(RepositoryError.recordNotFound("User", id));
    }

    return UserMapper.toUser(user).mapErr((validationError) =>
      RepositoryError.validationFailed(validationError.message, {
        validation: validationError,
      }),
    );
  }
}
