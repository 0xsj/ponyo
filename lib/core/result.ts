// result.ts
/**
 * Repository-layer error types and classes
 */
export type DataErrorKind =
  | "not_found"
  | "invalid"
  | "query"
  | "connection"
  | "unexpected";

export class DataError extends Error {
  public readonly context?: Record<string, unknown>;
  public readonly source?: Error;

  private constructor(
    public readonly kind: DataErrorKind,
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ) {
    super(message);
    this.context = options?.context;
    this.source = options?.source;
    this.name = "DataError";
  }

  static notFound(entity: string, id: string, source?: Error): DataError {
    return new DataError("not_found", `${entity} not found: ${id}`, {
      context: { entity, id },
      source,
    });
  }

  static invalid(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): DataError {
    return new DataError("invalid", message, options);
  }

  static query(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): DataError {
    return new DataError("query", message, options);
  }

  static connection(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): DataError {
    return new DataError("connection", message, options);
  }

  static unexpected(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): DataError {
    return new DataError("unexpected", message, options);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      kind: this.kind,
      message: this.message,
      context: this.context,
      source: this.source,
      stack: this.stack,
    };
  }
}

export type DataResult<T> =
  | { kind: "success"; data: T }
  | { kind: "error"; error: DataError };

/**
 * Service-layer error types and classes
 */
export type ServiceErrorKind =
  | "validation"
  | "not_found"
  | "auth"
  | "unexpected"
  | "network";

export class ServiceError extends Error {
  public readonly context?: Record<string, unknown>;
  public readonly source?: Error;

  private constructor(
    public readonly kind: ServiceErrorKind,
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ) {
    super(message);
    this.context = options?.context;
    this.source = options?.source;
    this.name = "ServiceError";
  }

  static validation(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): ServiceError {
    return new ServiceError("validation", message, options);
  }

  static notFound(entity: string, id: string, source?: Error): ServiceError {
    return new ServiceError("not_found", `${entity} not found: ${id}`, {
      context: { entity, id },
      source,
    });
  }

  static auth(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): ServiceError {
    return new ServiceError("auth", message, options);
  }

  static unexpected(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): ServiceError {
    return new ServiceError("unexpected", message, options);
  }

  static network(
    message: string,
    options?: {
      context?: Record<string, unknown>;
      source?: Error;
    },
  ): ServiceError {
    return new ServiceError("network", message, options);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      kind: this.kind,
      message: this.message,
      context: this.context,
      source: this.source,
      stack: this.stack,
    };
  }
}

export type ServiceResult<T> =
  | { kind: "success"; data: T }
  | { kind: "error"; error: ServiceError };

/**
 * Masks sensitive fields in the data
 */
function maskSensitive(data: any): any {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitive(item));
  }

  if (typeof data === "object") {
    const masked = { ...data };

    const sensitiveFields = [
      "password",
      "secret",
      "token",
      "accessToken",
      "refreshToken",
      "key",
      "apiKey",
      "credential",
      "auth",
    ];

    for (const key in masked) {
      if (
        sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        if (typeof masked[key] === "string") {
          const value = masked[key];
          if (value.length > 8) {
            masked[key] =
              `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
          } else {
            masked[key] = "********";
          }
        }
      } else if (typeof masked[key] === "object" && masked[key] !== null) {
        masked[key] = maskSensitive(masked[key]);
      }
    }

    return masked;
  }

  return data;
}

/**
 * Serializes any error into a JSON-compatible format with stack trace control
 */
export function serializeErr(
  error: unknown,
  meta?: Record<string, unknown>,
  options: {
    prettyPrint?: boolean;
    includeStacks?: boolean | "truncated";
    stackFrameLimit?: number;
  } = {},
): string | Record<string, unknown> {
  const {
    prettyPrint = true,
    includeStacks = false,
    stackFrameLimit = 3,
  } = options;

  const serialize = (err: unknown): Record<string, unknown> => {
    if (err instanceof DataError || err instanceof ServiceError) {
      const result: Record<string, unknown> = {
        name: err.name,
        kind: err.kind,
        message: err.message,
      };

      if (err.context) {
        result.context = err.context;
      }

      if (includeStacks) {
        if (includeStacks === "truncated" && err.stack) {
          const stackLines = err.stack.split("\n");
          result.stack = stackLines.slice(0, stackFrameLimit + 1).join("\n");
        } else if (includeStacks === true) {
          result.stack = err.stack;
        }
      }

      if (err.source) {
        result.source = serialize(err.source);
      }

      return result;
    }

    if (err instanceof Error) {
      const result: Record<string, unknown> = {
        name: err.name,
        message: err.message,
      };

      if (includeStacks) {
        if (includeStacks === "truncated" && err.stack) {
          const stackLines = err.stack.split("\n");
          result.stack = stackLines.slice(0, stackFrameLimit + 1).join("\n");
        } else if (includeStacks === true) {
          result.stack = err.stack;
        }
      }

      if ("cause" in err && err.cause) {
        result.cause = serialize(err.cause);
      }

      return result;
    }

    return {
      value: typeof err === "object" ? JSON.stringify(err) : String(err),
    };
  };

  const serialized = {
    error: serialize(error),
    meta,
    timestamp: new Date().toISOString(),
  };

  return prettyPrint ? JSON.stringify(serialized, null, 2) : serialized;
}

/**
 * Generic function for logging both error and success results
 */
export function logResult<T>(
  result: ServiceResult<T> | DataResult<T>,
  meta?: Record<string, unknown>,
  options: {
    prettyPrint?: boolean;
    includeStacks?: boolean | "truncated";
    stackFrameLimit?: number;
    maskSensitiveData?: boolean;
  } = {},
): void {
  const {
    prettyPrint = true,
    includeStacks = false,
    stackFrameLimit = 3,
    maskSensitiveData = true,
  } = options;

  if (result.kind === "error") {
    console.log(
      serializeErr(result.error, meta, {
        prettyPrint,
        includeStacks,
        stackFrameLimit,
      }),
    );
  } else {
    let data = result.data;

    if (maskSensitiveData) {
      data = maskSensitive(data);
    }

    const output = {
      result: {
        kind: "success",
        data,
      },
      meta,
      timestamp: new Date().toISOString(),
    };

    console.log(prettyPrint ? JSON.stringify(output, null, 2) : output);
  }
}

/**
 * A wrapper class that allows chaining operations on DataResult and ServiceResult
 */
export class ResultChain<T, E extends DataError | ServiceError> {
  constructor(
    private readonly result: { kind: "success" | "error"; data?: T; error?: E },
  ) {}

  /**
   * Maps DataResult errors to ServiceResult errors
   */
  mapErr(
    errorMap?: Partial<Record<DataErrorKind, ServiceErrorKind>>,
    defaultMessage?: string,
  ): ResultChain<T, ServiceError> {
    if (this.result.kind === "success") {
      return new ResultChain<T, ServiceError>(
        this.result as { kind: "success"; data: T },
      );
    }

    if (!this.result.error) {
      return new ResultChain<T, ServiceError>({
        kind: "error",
        error: ServiceError.unexpected("Unknown error occurred"),
      });
    }

    if (!(this.result.error instanceof DataError)) {
      if (this.result.error instanceof ServiceError) {
        return new ResultChain<T, ServiceError>({
          kind: "error",
          error: this.result.error,
        });
      }

      return new ResultChain<T, ServiceError>({
        kind: "error",
        error: ServiceError.unexpected("Unknown error type", {
          source:
            this.result.error instanceof Error
              ? this.result.error
              : new Error(String(this.result.error)),
        }),
      });
    }

    const dataError = this.result.error;

    const defaultErrorMap: Record<DataErrorKind, ServiceErrorKind> = {
      not_found: "not_found",
      invalid: "validation",
      query: "unexpected",
      connection: "network",
      unexpected: "unexpected",
    };

    const finalErrorMap = { ...defaultErrorMap, ...errorMap };

    const serviceErrorKind = finalErrorMap[dataError.kind];

    const message = defaultMessage || dataError.message;

    let serviceError: ServiceError;

    switch (serviceErrorKind) {
      case "not_found":
        if (dataError.context?.entity && dataError.context?.id) {
          serviceError = ServiceError.notFound(
            dataError.context.entity as string,
            dataError.context.id as string,
            dataError,
          );
        } else {
          serviceError = ServiceError.notFound("item", "unknown", dataError);
        }
        break;

      case "validation":
        serviceError = ServiceError.validation(message, {
          context: dataError.context,
          source: dataError,
        });
        break;

      case "auth":
        serviceError = ServiceError.auth(message, {
          context: dataError.context,
          source: dataError,
        });
        break;

      case "network":
        serviceError = ServiceError.network(message, {
          context: dataError.context,
          source: dataError,
        });
        break;

      case "unexpected":
      default:
        serviceError = ServiceError.unexpected(message, {
          context: dataError.context,
          source: dataError,
        });
        break;
    }

    return new ResultChain<T, ServiceError>({
      kind: "error",
      error: serviceError,
    });
  }

  /**
   * Logs the result with optional metadata
   */
  log(
    meta?: Record<string, unknown>,
    options?: {
      prettyPrint?: boolean;
      includeStacks?: boolean | "truncated";
      stackFrameLimit?: number;
      maskSensitiveData?: boolean;
    },
  ): ResultChain<T, E> {
    const {
      prettyPrint = true,
      includeStacks = false,
      stackFrameLimit = 3,
      maskSensitiveData = true,
    } = options || {};

    if (this.result.kind === "error" && this.result.error) {
      const serialized = serializeErr(this.result.error, meta, {
        prettyPrint,
        includeStacks,
        stackFrameLimit,
      });
      console.log(
        typeof serialized === "string"
          ? serialized
          : JSON.stringify(serialized, null, 2),
      );
    } else if (
      this.result.kind === "success" &&
      this.result.data !== undefined
    ) {
      let data = this.result.data;

      if (maskSensitiveData) {
        data = maskSensitive(data);
      }

      const output = {
        result: {
          kind: "success",
          data,
        },
        meta,
        timestamp: new Date().toISOString(),
      };

      console.log(prettyPrint ? JSON.stringify(output, null, 2) : output);
    }

    return this;
  }

  /**
   * Transforms the data in a success result
   */
  map<U>(fn: (data: T) => U): ResultChain<U, E> {
    if (this.result.kind === "success" && this.result.data !== undefined) {
      try {
        return new ResultChain<U, E>({
          kind: "success",
          data: fn(this.result.data),
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        return new ResultChain<U, E>({
          kind: "error",
          error: (this.result.error?.constructor as any).unexpected(
            "Error transforming data",
            { source: err },
          ) as E,
        });
      }
    }

    return new ResultChain<U, E>({
      kind: "error",
      error: this.result.error,
    });
  }

  /**
   * Validates the data in a success result, returning an error if validation fails
   */
  validate<Schema>(
    schema: {
      safeParse: (data: any) => { success: boolean; data?: any; error?: any };
    },
    errorMessage: string = "Validation failed",
  ): ResultChain<T, ServiceError> {
    if (this.result.kind !== "success" || !this.result.data) {
      return new ResultChain<T, ServiceError>(this.result as any);
    }

    const validation = schema.safeParse(this.result.data);
    if (!validation.success) {
      const error = ServiceError.validation(errorMessage, {
        context: { validationErrors: validation.error },
        source:
          validation.error instanceof Error
            ? validation.error
            : new Error(String(validation.error)),
      });

      return new ResultChain<T, ServiceError>({
        kind: "error",
        error,
      });
    }

    return new ResultChain<T, ServiceError>({
      kind: "success",
      data: validation.data,
    });
  }

  /**
   * Unwraps the result to get the final value
   */
  unwrap(): { kind: "success" | "error"; data?: T; error?: E } {
    return this.result;
  }

  /**
   * Returns the result as a ServiceResult if E is ServiceError,
   * or as DataResult if E is DataError
   */
  toResult(): E extends ServiceError ? ServiceResult<T> : DataResult<T> {
    if (this.result.kind === "success") {
      return { kind: "success", data: this.result.data as T } as any;
    } else {
      return { kind: "error", error: this.result.error as E } as any;
    }
  }

  /**
   * Explicitly returns the result as a ServiceResult, regardless of error type
   */
  toServiceResult(): ServiceResult<T> {
    if (this.result.kind === "success") {
      return { kind: "success", data: this.result.data as T };
    } else if (this.result.error instanceof ServiceError) {
      return { kind: "error", error: this.result.error };
    } else {
      return {
        kind: "error",
        error: ServiceError.unexpected(
          this.result.error instanceof Error
            ? this.result.error.message
            : "Unknown error",
          {
            source:
              this.result.error instanceof Error
                ? this.result.error
                : undefined,
          },
        ),
      };
    }
  }
}

/**
 * Creates a ResultChain from a DataResult or ServiceResult
 */
export function chain<T, E extends DataError | ServiceError>(result: {
  kind: "success" | "error";
  data?: T;
  error?: E;
}): ResultChain<T, E> {
  return new ResultChain<T, E>(result);
}
