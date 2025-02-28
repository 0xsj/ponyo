import { AuthRepository } from "./auth.repository";
import {
  AuthSession,
  AuthCredentials,
  authSessionSchema,
  authCredentialSchema,
} from "./auth.types";
import {
  ServiceError,
  ServiceResult,
  chain,
  DataError,
} from "@/lib/core/result";

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async signIn(
    credentials: AuthCredentials,
  ): Promise<ServiceResult<AuthSession>> {
    const credentialsValidation = authCredentialSchema.safeParse(credentials);
    if (!credentialsValidation.success) {
      return chain<AuthSession, ServiceError>({
        kind: "error",
        error: ServiceError.validation("Invalid credentials", {
          context: { validationErrors: credentialsValidation.error.format() },
        }),
      })
        .log({ operation: "signIn.validation" })
        .toServiceResult();
    }

    const result = await this.authRepository.signIn(credentialsValidation.data);

    return chain<AuthSession, DataError>(result)
      .mapErr({
        invalid: "auth",
        query: "unexpected",
      })
      .log({
        operation: "signIn",
        identifier: credentials.identifier,
      })
      .validate(authSessionSchema, "Invalid session data")
      .toServiceResult();
  }

  async signOut(): Promise<ServiceResult<void>> {
    const result = await this.authRepository.signOut();

    return chain<void, DataError>(result)
      .mapErr(undefined, "Failed to sign out")
      .log({ operation: "signOut" })
      .toServiceResult();
  }
}
