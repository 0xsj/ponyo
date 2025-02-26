/**
 * 
 */

export type DataErrorKind = "not_found" | "invalid" | "query" | "connection";

export class DataError {
  private constructor(
    public readonly kind: DataErrorKind,
    public readonly message: string,
    public readonly context?: Record<string, unknown>,
  ) {}

  static notFound(entity: string, id: string): DataError {
    return new DataError("not_found", `${entity} not found ${id}`, {
      entity,
      id,
    });
  }

  static invalid(
    message: string,
    context?: Record<string, unknown>,
  ): DataError {
    return new DataError("invalid", message, context);
  }

  static query(message: string, context?: Record<string, unknown>): DataError {
    return new DataError("query", message, context);
  }

  static connection(
    message: string,
    context?: Record<string, unknown>,
  ): DataError {
    return new DataError("connection", message, context);
  }
}

export type DataResult<T> =
  | { kind: "success"; data: T }
  | { kind: "error"; error: DataError };

export type ServiceErrorKind =
  | "validation"
  | "not_found"
  | "auth"
  | "unexpected"
  | "network";

export class ServiceError {
  private constructor(
    public readonly kind: ServiceErrorKind,
    public readonly message: string,
    public readonly context?: Record<string, unknown>,
  ) {}

  static validation(
    message: string,
    context?: Record<string, unknown>,
  ): ServiceError {
    return new ServiceError("validation", message, context);
  }

  static notFound(entity: string, id: string): ServiceError {
    return new ServiceError("not_found", `${entity} not found: ${id}`, {
      entity,
      id,
    });
  }

  static auth(
    message: string,
    context?: Record<string, unknown>,
  ): ServiceError {
    return new ServiceError("auth", message, context);
  }

  static unexpected(
    message: string,
    context?: Record<string, unknown>,
  ): ServiceError {
    return new ServiceError("unexpected", message, context);
  }

  static network(
    message: string,
    context?: Record<string, unknown>,
  ): ServiceError {
    return new ServiceError("network", message, context);
  }
}

export type ServiceResult<T> =
  | { kind: "success"; data: T }
  | { kind: "error"; error: ServiceError };
