import { Database } from "../../database.types";

export interface UserQueryKeys {
  all: readonly ["users"];
  lists: readonly ["users", "list"];
  list: (filters: string) => readonly ["users", "list", { filters: string }];
  details: readonly ["users", "detail"];
  detail: (id: string) => readonly ["users", "detail", string];
}

export const userKeys: UserQueryKeys = {
  all: ["users"],
  lists: ["users", "list"],
  list: (filters: string) => ["users", "list", { filters }],
  details: ["users", "detail"],
  detail: (id: string) => ["users", "detail", id],
} as const;

export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
