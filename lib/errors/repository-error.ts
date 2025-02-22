import { ApplicationError } from "./base-error";

type RepositoryErrorKind =
  | "connection_failed"
  | "record_not_found"
  | "unique_violation"
  | "validation_failed"
  | "query_failed"
  | "invalid_session"

export class RepositoryError extends ApplicationError<RepositoryErrorKind> {
  constructor(
    public readonly kind: RepositoryErrorKind,
    message: string,
    public readonly code: string,
    public readonly status: number,
    context?: Record<string, unknown>,
  ) {
    super(message, context);
  }

  static connectionFailed(message: string, context?: Record<string, unknown>) {
    return new RepositoryError(
      "connection_failed",
      message,
      "DB_CONNECTION_ERROR",
      503,
      context,
    );
  }

  static recordNotFound(entity: string, id: string) {
    return new RepositoryError(
      "record_not_found",
      `${entity} not found: ${id}`,
      "NOT_FOUND",
      404,
      { entity, id },
    );
  }

  static uniqueViolation(entity: string, field: string) {
    return new RepositoryError(
      "unique_violation",
      `${entity} with this ${field} already exists`,
      "CONFLICT",
      409,
      { entity, field },
    );
  }

  static queryFailed(message: string, context?: Record<string, unknown>) {
    return new RepositoryError(
      "query_failed",
      message,
      "QUERY_ERROR",
      500,
      context,
    );
  }

  static validationFailed(message: string, context?: Record<string, unknown>) {
    return new RepositoryError(
      "validation_failed",
      message,
      "VALIDATION_ERROR",
      400,
      context,
    );
  }

  static invalidSession(message: string, context?: Record<string, unknown>) {
    return new RepositoryError(
      "invalid_session",
      message,
      "INVALID_SESSION",
      400,
      context,
    );
  }
}
