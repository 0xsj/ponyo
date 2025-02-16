import { supabase } from "../client/supabase-client";
import { TypedSupabaseClient } from "../client/supabase-client";
import type { Database } from "../database.types";
import { User } from "@/lib/models";
import { Result, APIResult } from "@/lib/shared/result";
import { APIError } from "@/lib/errors/api-error";

export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];

export class UserAPI {
  private client: TypedSupabaseClient;

  constructor() {
    this.client = supabase;
  }

  async get(id: string): Promise<APIResult<User>> {
    try {
      const response = await this.client
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (response.error) {
        return Result.fail(
          new APIError(response.error.message, "USER_NOT_FOUND", 404),
        ) as APIResult<User>;
      }

      if (!response.data) {
        return Result.fail(
          new APIError("User not found", "USER_NOT_FOUND", 404),
        ) as APIResult<User>;
      }

      return Result.ok(this.toUser(response.data)) as APIResult<User>;
    } catch (error: any) {
      return Result.fail(
        new APIError(
          error.message || "Failed to get user",
          "USER_GET_ERROR",
          500,
        ),
      ) as APIResult<User>;
    }
  }

  async getAll(): Promise<APIResult<User[]>> {
    try {
      const response = await this.client
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (response.error) {
        return Result.fail(
          new APIError(response.error.message, "USERS_FETCH_ERROR", 500),
        ) as APIResult<User[]>;
      }

      const users = response.data.map((row) => this.toUser(row));
      return Result.ok(users) as APIResult<User[]>;
    } catch (error: any) {
      return Result.fail(
        new APIError(
          error.message || "Failed to fetch users",
          "USERS_FETCH_ERROR",
          500,
        ),
      ) as APIResult<User[]>;
    }
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
