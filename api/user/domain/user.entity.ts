//user.entity.ts
import { Database } from "@/lib/supabase";
import { z } from "zod";

export type DBUser = Database["public"]["Tables"]["users"]["Row"];
export type DBUserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type DBUserUpdate = Database["public"]["Tables"]["users"]["Update"];

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  account_status: z
    .string()
    .nullable()
    .transform((val) => val ?? "pending"),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  email_verified: z.boolean().nullable(),
  is_active: z.boolean().nullable(),
  is_deleted: z.boolean().nullable(),
  last_login: z.string().nullable(),
}) satisfies z.ZodType<DBUser>;

export const createUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  account_status: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  email_verified: z.boolean().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  is_deleted: z.boolean().nullable().optional(),
  last_login: z.string().nullable().optional(),
}) satisfies z.ZodType<DBUserInsert>;

export const updateUserSchema =
  userSchema.partial() satisfies z.ZodType<DBUserUpdate>;

export type User = z.infer<typeof userSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
