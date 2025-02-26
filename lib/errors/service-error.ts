import { ApplicationError } from "./base-error";

type ServiceErrorKind =
  | "not_found"
  | "validation_failed"
  | "unauthorized"
  | "forbidden"
  | "conflict"
  | "service_unavailable"
  | "unexpected";

export class ServiceError extends ApplicationError<ServiceErrorKind> {
  constructor(
    public readonly kind: ServiceErrorKind,
    message: string,
    public readonly code: string,
    public readonly status: number,
    context?: Record<string, unknown>,
  ) {
    super(message, context);
  }

  static notFound(message: string, context?: Record<string, unknown>) {
    return new ServiceError("not_found", message, "NOT_FOUND", 404, context);
  }

  static validationFailed(message: string, context?: Record<string, unknown>) {
    return new ServiceError(
      "validation_failed",
      message,
      "VALIDATION_ERROR",
      400,
      context,
    );
  }

  static unauthorized(
    message: string = "Unauthorized",
    context?: Record<string, unknown>,
  ) {
    return new ServiceError(
      "unauthorized",
      message,
      "UNAUTHORIZED",
      401,
      context,
    );
  }

  static forbidden(
    message: string = "Forbidden",
    context?: Record<string, unknown>,
  ) {
    return new ServiceError("forbidden", message, "FORBIDDEN", 403, context);
  }

  static conflict(message: string, context?: Record<string, unknown>) {
    return new ServiceError("conflict", message, "CONFLICT", 409, context);
  }

  static serviceUnavailable(
    message: string,
    context?: Record<string, unknown>,
  ) {
    return new ServiceError(
      "service_unavailable",
      message,
      "SERVICE_UNAVAILABLE",
      503,
      context,
    );
  }

  static unexpected(message: string, context?: Record<string, unknown>) {
    return new ServiceError(
      "unexpected",
      message,
      "INTERNAL_SERVER_ERROR",
      500,
      context,
    );
  }
}
