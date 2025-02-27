import { z } from "zod";
import { SupabaseAuthSession, SupabaseAuthUser } from "@/lib/supabase";

export const rawAuthUserSchema = z.custom<SupabaseAuthUser>().pipe(
  z.object({
    id: z.string().uuid(),
    email: z.string().email().nullable(),
    email_confirmed_at: z.string().datetime().nullable(),
  }),
);

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  email_confirmed_at: z.boolean(),
});

export const authSessionSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});

export const authCredentialSchema = z.object({
  identifier: z.string(),
  secret: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthCredentials = z.infer<typeof authCredentialSchema>;
