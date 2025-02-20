import { ApplicationError } from "./base-error";
import { z } from "zod";

type ValidationErrorKind = "validation_error";

export class ValidationError extends ApplicationError<ValidationErrorKind> {
  public readonly kind = "validation_error";
  public readonly code = "VALIDATION_ERROR";
  public readonly status = 400;

  static fromZod(error: z.ZodError) {
    return new ValidationError("Validation failed", { issues: error.issues });
  }

  static invalidInput(message: string, context?: Record<string, unknown>) {
    return new ValidationError(message, context);
  }
}
