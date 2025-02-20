import { APIError } from "@/lib/errors/api-error";
import { TypedSupabaseClient } from "../../client/supabase-client";
import { IUser } from "@/lib/interfaces";
import { User } from "@/lib/models";
import { Result } from "@/lib/shared/result";
import { UserRow } from "./user.types";
import {
  RepositoryError,
  RepositoryErrorCode,
} from "@/lib/errors/repository-error";
import { CreateUserDTO } from "@/lib/dto";

export class UserAPI implements IUser {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  async create(data: CreateUserDTO): Promise<Result<User, RepositoryError>> {
    const { data: user, error } = await this.supabase
      .from("users")
      .insert({
        id: data.id,
        email: data.email,
        username: data.username,
        is_active: data.isActive === true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error)
      return Result.Err(RepositoryError.fromPostgresError(error, "User"));
    if (!user)
      return Result.Err(
        new RepositoryError(
          RepositoryErrorCode.NotFound,
          "Failed to create user",
        ),
      );
    return Result.Ok(this.toUser(user));
  }

  async get(id: string): Promise<Result<User, RepositoryError>> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error)
      return Result.Err(RepositoryError.fromPostgresError(error, "User"));
    if (!data)
      return Result.Err(
        new RepositoryError(
          RepositoryErrorCode.NotFound,
          `User ${id} not found`,
        ),
      );

    return Result.Ok(this.toUser(data));
  }

  private toUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      isActive: row.is_active ?? false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
