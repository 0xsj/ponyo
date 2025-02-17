export enum RepositoryErrorCode {
  // Resource Errors
  NotFound = "NOT_FOUND",
  AlreadyExists = "ALREADY_EXISTS",

  // Authentication/Authorization
  Unauthorized = "UNAUTHORIZED",
  InvalidCredentials = "INVALID_CREDENTIALS",
  InsufficientPrivileges = "INSUFFICIENT_PRIVILEGES",

  // Data Integrity
  UniqueViolation = "UNIQUE_VIOLATION",
  ForeignKeyViolation = "FOREIGN_KEY_VIOLATION",
  NotNullViolation = "NOT_NULL_VIOLATION",
  CheckViolation = "CHECK_VIOLATION",

  // Connection/System
  ConnectionError = "CONNECTION_ERROR",
  ConnectionTimeout = "CONNECTION_TIMEOUT",
  ConnectionLost = "CONNECTION_LOST",

  // Query/Syntax
  InvalidQuery = "INVALID_QUERY",
  InvalidParameter = "INVALID_PARAMETER",
  SyntaxError = "SYNTAX_ERROR",

  // Data
  InvalidDataFormat = "INVALID_DATA_FORMAT",
  DataTooLong = "DATA_TOO_LONG",
  InvalidTextRepresentation = "INVALID_TEXT_REPRESENTATION",
  NumericValueOutOfRange = "NUMERIC_VALUE_OUT_OF_RANGE",

  // Transaction
  TransactionError = "TRANSACTION_ERROR",
  SerializationFailure = "SERIALIZATION_FAILURE",
  DeadlockDetected = "DEADLOCK_DETECTED",

  // Schema
  TableNotFound = "TABLE_NOT_FOUND",
  ColumnNotFound = "COLUMN_NOT_FOUND",
  UndefinedColumn = "UNDEFINED_COLUMN",
  UndefinedTable = "UNDEFINED_TABLE",

  // System
  OutOfMemory = "OUT_OF_MEMORY",
  DiskFull = "DISK_FULL",

  // Catch-all
  UnknownError = "UNKNOWN_ERROR",
}

export class RepositoryError extends Error {
  constructor(
    public readonly code: RepositoryErrorCode,
    message: string,
    public readonly details?: Record<string, any>,
    public readonly originalError?: any,
  ) {
    super(message);
    this.name = "RepositoryError";
  }

  static fromPostgresError(error: any, resource: string): RepositoryError {
    const errorCode = error?.code;
    const message = error?.message || `${resource} operation failed`;
    const details = error?.details;

    // Map Postgres error codes to RepositoryErrorCode
    switch (errorCode) {
      // Resource errors
      case "PGRST116":
        return new RepositoryError(
          RepositoryErrorCode.NotFound,
          `${resource} not found`,
          details,
          error,
        );

      // Authentication/Authorization
      case "28000":
      case "28P01":
        return new RepositoryError(
          RepositoryErrorCode.InvalidCredentials,
          "Invalid credentials",
          details,
          error,
        );
      case "42501":
        return new RepositoryError(
          RepositoryErrorCode.InsufficientPrivileges,
          "Insufficient privileges",
          details,
          error,
        );

      // Data Integrity
      case "23505":
        return new RepositoryError(
          RepositoryErrorCode.UniqueViolation,
          "Unique constraint violation",
          details,
          error,
        );
      case "23503":
        return new RepositoryError(
          RepositoryErrorCode.ForeignKeyViolation,
          "Foreign key violation",
          details,
          error,
        );
      case "23502":
        return new RepositoryError(
          RepositoryErrorCode.NotNullViolation,
          "Not null violation",
          details,
          error,
        );
      case "23514":
        return new RepositoryError(
          RepositoryErrorCode.CheckViolation,
          "Check constraint violation",
          details,
          error,
        );

      // Connection/System
      case "08000":
        return new RepositoryError(
          RepositoryErrorCode.ConnectionError,
          "Connection error",
          details,
          error,
        );
      case "08006":
        return new RepositoryError(
          RepositoryErrorCode.ConnectionLost,
          "Connection lost",
          details,
          error,
        );

      // Query/Syntax
      case "42601":
        return new RepositoryError(
          RepositoryErrorCode.SyntaxError,
          "Syntax error",
          details,
          error,
        );
      case "42P01":
        return new RepositoryError(
          RepositoryErrorCode.TableNotFound,
          "Table not found",
          details,
          error,
        );
      case "42703":
        return new RepositoryError(
          RepositoryErrorCode.UndefinedColumn,
          "Undefined column",
          details,
          error,
        );

      // Data format
      case "22000":
      case "22P02":
        return new RepositoryError(
          RepositoryErrorCode.InvalidDataFormat,
          "Invalid data format",
          details,
          error,
        );
      case "22001":
        return new RepositoryError(
          RepositoryErrorCode.DataTooLong,
          "Data too long",
          details,
          error,
        );
      case "22003":
        return new RepositoryError(
          RepositoryErrorCode.NumericValueOutOfRange,
          "Numeric value out of range",
          details,
          error,
        );

      // Transaction
      case "40001":
        return new RepositoryError(
          RepositoryErrorCode.SerializationFailure,
          "Serialization failure",
          details,
          error,
        );
      case "40P01":
        return new RepositoryError(
          RepositoryErrorCode.DeadlockDetected,
          "Deadlock detected",
          details,
          error,
        );

      // Default case
      default:
        return new RepositoryError(
          RepositoryErrorCode.UnknownError,
          message,
          details,
          error,
        );
    }
  }
}
