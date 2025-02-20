import { ApplicationError } from "./base-error";

type RepositoryErrorKind =
  | "connection_failed"
  | "record_not_found"
  | "unique_violation"
  | "validation_failed"
  | "query_failed";

export class RepsitoryError extends ApplicationError<RepositoryErrorKind> {
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
    return new RepsitoryError(
      "connection_failed",
      message,
      "DB_CONNECTION_ERROR",
      503,
      context,
    );
  }

  static recordNotFound(entity: string, id: string) {
    return new RepsitoryError(
      "record_not_found",
      `${entity} not found: ${id}`,
      "NOT_FOUND",
      404,
      { entity, id },
    );
  }

  static uniqueViolation(entity: string, field: string) {
    return new RepsitoryError(
      "unique_violation",
      `${entity} with this ${field} already exists`,
      "CONFLICT",
      409,
      { entity, field },
    );
  }

  static queryFailed(message: string, context?: Record<string, unknown>) {
    return new RepsitoryError(
      "query_failed",
      message,
      "QUERY_ERROR",
      500,
      context,
    );
  }

  static validationFailed(message: string, context?: Record<string, unknown>) {
    return new RepsitoryError(
      "validation_failed",
      message,
      "VALIDATION_ERROR",
      400,
      context,
    );
  }
}
