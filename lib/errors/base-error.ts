/**
 * Abstract base class for creating custom application errors.
 *
 * This class is designed to standardize error handling across the application by enforcing
 * a consistent structure for errors. It includes properties like `kind`, `code`, `status`,
 * `message`, and an optional `context` for additional error details.
 *
 * @template K - A string literal type representing the kind/category of the error.
 * @template C - (Optional) The type of additional context data associated with the error. Defaults to `unknown`.
 *
 * @property {K} kind - A unique identifier for the type/category of the error.
 * @property {string} code - A unique error code for identifying the specific error.
 * @property {number} status - The HTTP status code associated with the error.
 * @property {string} message - A human-readable description of the error.
 * @property {C} [context] - Optional additional data or context related to the error.
 *
 * @method toJSON - Serializes the error into a JSON object, including all relevant properties.
 *
 * @example
 * class NotFoundError extends ApplicationError<'NotFound'> {
 *     readonly kind = 'NotFound' as const;
 *     readonly code = 'ERR_NOT_FOUND';
 *     readonly status = 404;
 *
 *     constructor(message: string, context?: { resource: string }) {
 *         super(message, context);
 *     }
 * }
 *
 * const error = new NotFoundError('Resource not found', { resource: 'User' });
 * console.log(error.toJSON());
 * // Output:
 * // {
 * //   kind: 'NotFound',
 * //   code: 'ERR_NOT_FOUND',
 * //   status: 404,
 * //   message: 'Resource not found',
 * //   context: { resource: 'User' }
 * // }
 */
export abstract class ApplicationError<K extends string, C = unknown> {
  abstract readonly kind: K;
  abstract readonly code: string;
  abstract readonly status: number;

  constructor(
    public readonly message: string,
    public readonly context?: C,
  ) {}

  public toJSON() {
    return {
      kind: this.kind,
      code: this.code,
      status: this.status,
      message: this.message,
      context: this.context,
    };
  }
}
