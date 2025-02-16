export class APIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = "APIError";
  }

  static fromResponse(error: any): APIError {
    return new APIError(
      error.message || "An unknown error occurred",
      error.code || "UNKNOWN_ERROR",
      error.status,
      error.details,
    );
  }
}

export class ValidationError extends APIError {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>,
  ) {
    super(message, "VALIDATION_ERROR", 400, { fields });
    this.name = "ValidationError";
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Not authorized to perform this action") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthorizationError";
  }
}
