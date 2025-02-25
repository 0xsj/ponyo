//auth.entity.ts
import { z } from "zod";

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  metadata: z
    .object({
      providers: z.array(z.string()),
      appMetadata: z.record(z.unknown()),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
    .optional(),
});

export const authSessionSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});

export const mfaSchema = z
  .object({
    code: z.string().optional(),
    deviceId: z.string().optional(),
  })
  .optional();

export const oauthSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number().optional(),
  })
  .optional();

export const sessionContextSchema = z
  .object({
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  })
  .optional();

export const authCredentialsSchema = z.object({
  identifier: z.string(),
  secret: z.string().optional(),
  mfa: mfaSchema,
  oauth: oauthSchema,
  apiKey: z.string().optional(),
  session: sessionContextSchema,
});

export const verificationCodeSchema = z.object({
  code: z.string(),
  identifier: z.string().email(),
  expiresAt: z.number(),
  verifiedAt: z.number().nullable().optional(),
  attempts: z.number().default(0),
});

export const emailVerificationRequestSchema = z.object({
  email: z.string().email(),
});

export const emailVerificationSubmitSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export const oauthProviderSchema = z.enum(["google", "facebook", "apple"]);

export const authEventTypeSchema = z.enum([
  "SIGNED_IN",
  "SIGNED_OUT",
  "AUTH_USER_UPDATED",
  "AUTH_USER_DELETED",
]);

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type AuthEventType = z.infer<typeof authEventTypeSchema>;
export type VerificationCode = z.infer<typeof verificationCodeSchema>;
export type EmailVerificationRequest = z.infer<
  typeof emailVerificationRequestSchema
>;
export type EmailVerificationSubmit = z.infer<
  typeof emailVerificationSubmitSchema
>;

export interface AuthEventPayload {
  type: AuthEventType;
  session?: AuthSession | null;
  user?: AuthUser | null;
}
