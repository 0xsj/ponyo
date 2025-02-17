export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly ok: boolean,
    private readonly value: T | null,
    private readonly error: E | null,
  ) {}

  static Ok<T, E extends Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, null);
  }

  static Err<T, E extends Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, null, error);
  }

  isOk(): this is Result<T, never> {
    return this.ok;
  }

  isErr(): this is Result<never, E> {
    return !this.ok;
  }

  unwrap(): T {
    if (!this.ok) {
      throw new Error("Called unwrap on an Err value");
    }
    return this.value!;
  }

  unwrapErr(): E {
    if (this.ok) {
      throw new Error("Called unwrapErr on an Ok value");
    }
    return this.error!;
  }

  unwrapOr(defaultValue: T): T {
    return this.ok ? this.value! : defaultValue;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.ok ? Result.Ok(fn(this.value!)) : Result.Err(this.error!);
  }

  mapErr<F extends Error>(fn: (error: E) => F): Result<T, F> {
    return this.ok ? Result.Ok(this.value!) : Result.Err(fn(this.error!));
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.ok ? fn(this.value!) : Result.Err(this.error!);
  }

  match<U>(options: { Ok: (value: T) => U; Err: (error: E) => U }): U {
    return this.ok ? options.Ok(this.value!) : options.Err(this.error!);
  }
}
