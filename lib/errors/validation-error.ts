// validation-error.ts
import { ApplicationError } from "./base-error";
import { z } from "zod";

type ValidationErrorKind =
  | "validation_error"
  | "invalid_input"
  | "invalid_response"
  | "invalid_data_structure"
  | "invalid_session"
  | "schema_validation_failed";

export class ValidationError extends ApplicationError<ValidationErrorKind> {
  constructor(
    public readonly kind: ValidationErrorKind,
    message: string,
    public readonly code: string,
    public readonly status: number,
    context?: Record<string, unknown>,
  ) {
    super(message, context);
  }

  static fromZod(error: z.ZodError) {
    return new ValidationError(
      "schema_validation_failed",
      "Schema validation failed",
      "SCHEMA_VALIDATION_ERROR",
      400,
      { issues: error.issues },
    );
  }

  static invalidInput(message: string, context?: Record<string, unknown>) {
    return new ValidationError(
      "invalid_input",
      message,
      "INVALID_INPUT",
      400,
      context,
    );
  }

  static invalidResponse(message: string, context?: Record<string, unknown>) {
    return new ValidationError(
      "invalid_response",
      message,
      "INVALID_RESPONSE",
      400,
      context,
    );
  }

  static invalidDataStructure(
    message: string,
    context?: Record<string, unknown>,
  ) {
    return new ValidationError(
      "invalid_data_structure",
      message,
      "INVALID_DATA_STRUCTURE",
      400,
      context,
    );
  }

  static invalidSession(message: string, context?: Record<string, unknown>) {
    return new ValidationError(
      "invalid_session",
      message,
      "INVALID_SESSION",
      400,
      context,
    );
  }
}
