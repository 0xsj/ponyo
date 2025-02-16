// /lib/shared/result.ts
import { APIError } from "../errors/api-error";

export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly value: T | null,
    private readonly error: E | null,
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result(value, null);
  }

  static fail<E extends Error>(error: E): Result<never, E> {
    return new Result<never, E>(null as never, error);
  }

  isOk(): boolean {
    return this.error === null;
  }

  isFail(): boolean {
    return this.error !== null;
  }

  getValue(): T {
    if (this.value === null) {
      throw new Error("Cannot get value from a failed result");
    }
    return this.value;
  }

  getError(): E {
    if (this.error === null) {
      throw new Error("Cannot get error from a successful result");
    }
    return this.error;
  }

  // Fixed map method preserving the error type
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.ok(fn(this.getValue())) as Result<U, E>;
    }
    return Result.fail(this.getError());
  }

  match<U>(options: { ok: (value: T) => U; fail: (error: E) => U }): U {
    return this.isOk()
      ? options.ok(this.getValue())
      : options.fail(this.getError());
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? fn(this.getValue()) : Result.fail(this.getError());
  }
}

export type APIResult<T> = Result<T, APIError>;
