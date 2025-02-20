import { ApplicationError } from "./base-error";

type QueryErrorKind = 
  | "query_failed"
  | "cache_failed"
  | "stale_data";

export class QueryError extends ApplicationError<QueryErrorKind> {
  constructor(
    public readonly kind: QueryErrorKind,
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly retry: boolean,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }
}