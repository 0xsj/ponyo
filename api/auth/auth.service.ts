import { AuthRepository } from "./auth.repository";
import { AuthSession, AuthCredentials, authSessionSchema } from "./auth.types";
import { ServiceResult, ServiceError } from "@/lib/core/result";

export class AuthService {
  private readonly authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async signIn(
    credentials: AuthCredentials,
  ): Promise<ServiceResult<AuthSession>> {
    if (!credentials.identifier || !credentials.secret) {
      return {
        kind: "error",
        error: ServiceError.validation("Email and password are required"),
      };
    }

    const result = await this.authRepository.signIn(credentials);

    if (result.kind === "error") {
      switch (result.error.kind) {
        case "invalid":
          return {
            kind: "error",
            error: ServiceError.validation(result.error.message),
          };
        case "query":
          return {
            kind: "error",
            error: ServiceError.unexpected(
              result.error.message,
              result.error.context,
            ),
          };
        default:
          return {
            kind: "error",
            error: ServiceError.unexpected("Authentication failed"),
          };
      }
    }
    const validationResult = authSessionSchema.safeParse(result.data);
    if (!validationResult.success) {
      return {
        kind: "error",
        error: ServiceError.validation("Invalid session data", {
          cause: validationResult.error,
        }),
      };
    }
    return { kind: "success", data: validationResult.data };
  }
}
